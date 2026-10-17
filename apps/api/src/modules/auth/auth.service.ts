import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import ms from 'ms';
import { Admin } from '../admins/entities/admin.entity';
import { toPublicAdmin } from '../admins/admin-public';
import { RefreshToken } from './entities/refresh-token.entity';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private adminsRepo: Repository<Admin>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.adminsRepo.findOne({ where: { email } });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // A locked account gets the same generic error as a wrong password so the
    // response never reveals which emails exist.
    if (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const matches = await bcrypt.compare(password, admin.passwordHash);
    if (!matches) {
      await this.registerFailedLogin(admin);
      throw new UnauthorizedException('Invalid credentials');
    }
    if (admin.failedLoginAttempts > 0 || admin.lockedUntil) {
      admin.failedLoginAttempts = 0;
      admin.lockedUntil = null;
      await this.adminsRepo.save(admin);
    }
    return admin;
  }

  private async registerFailedLogin(admin: Admin): Promise<void> {
    const max = this.configService.get<number>('LOGIN_MAX_FAILED_ATTEMPTS', 5);
    const lockMinutes = this.configService.get<number>(
      'LOGIN_LOCK_MINUTES',
      15,
    );
    // An expired lock starts a fresh count.
    const expired =
      admin.lockedUntil && admin.lockedUntil.getTime() <= Date.now();
    const attempts = (expired ? 0 : admin.failedLoginAttempts) + 1;
    if (attempts >= max) {
      admin.failedLoginAttempts = 0;
      admin.lockedUntil = new Date(Date.now() + lockMinutes * 60_000);
    } else {
      admin.failedLoginAttempts = attempts;
      admin.lockedUntil = null;
    }
    await this.adminsRepo.save(admin);
  }

  async login(
    email: string,
    password: string,
  ): Promise<TokenPair & { admin: Partial<Admin> }> {
    const admin = await this.validateAdmin(email, password);
    const tokens = await this.issueTokenPair(admin);
    return { ...tokens, admin: toPublicAdmin(admin) };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const payload = this.verifyRefreshToken(refreshToken);

    const admin = await this.adminsRepo.findOne({
      where: { id: payload.sub },
    });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const activeTokens = await this.refreshTokensRepo.find({
      where: { adminId: admin.id, revoked: false },
    });

    let matchedToken: RefreshToken | null = null;
    for (const stored of activeTokens) {
      if (stored.expiresAt.getTime() < Date.now()) continue;
      if (await bcrypt.compare(refreshToken, stored.tokenHash)) {
        matchedToken = stored;
        break;
      }
    }

    if (!matchedToken) {
      await this.refreshTokensRepo.update(
        { adminId: admin.id, revoked: false },
        { revoked: true },
      );
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    matchedToken.revoked = true;
    await this.refreshTokensRepo.save(matchedToken);

    return this.issueTokenPair(admin);
  }

  async logout(refreshToken: string): Promise<void> {
    let payload: { sub: string };
    try {
      payload = this.verifyRefreshToken(refreshToken);
    } catch {
      return;
    }
    const activeTokens = await this.refreshTokensRepo.find({
      where: { adminId: payload.sub, revoked: false },
    });
    for (const stored of activeTokens) {
      if (await bcrypt.compare(refreshToken, stored.tokenHash)) {
        stored.revoked = true;
        await this.refreshTokensRepo.save(stored);
        break;
      }
    }
  }

  private verifyRefreshToken(refreshToken: string): { sub: string } {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async issueTokenPair(admin: Admin): Promise<TokenPair> {
    const accessToken = this.jwtService.sign(
      { sub: admin.id, email: admin.email, role: admin.role },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
        ) as JwtSignOptions['expiresIn'],
      },
    );

    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );
    const refreshToken = this.jwtService.sign(
      { sub: admin.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpiresIn as JwtSignOptions['expiresIn'],
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(
      Date.now() + ms(refreshExpiresIn as ms.StringValue),
    );

    const row = this.refreshTokensRepo.create({
      adminId: admin.id,
      tokenHash,
      expiresAt,
      revoked: false,
    });
    await this.refreshTokensRepo.save(row);

    return { accessToken, refreshToken };
  }
}
