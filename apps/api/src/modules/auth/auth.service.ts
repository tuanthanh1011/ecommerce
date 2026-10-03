import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import msFn = require('ms');
import { Admin } from '../admins/entities/admin.entity';
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
    const matches = await bcrypt.compare(password, admin.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return admin;
  }

  async login(
    email: string,
    password: string,
  ): Promise<TokenPair & { admin: Partial<Admin> }> {
    const admin = await this.validateAdmin(email, password);
    const tokens = await this.issueTokenPair(admin);
    return { ...tokens, admin: this.sanitizeAdmin(admin) };
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
      { sub: admin.id, email: admin.email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
        ) as any,
      },
    );

    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );
    const refreshToken = this.jwtService.sign(
      { sub: admin.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpiresIn as any,
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + (msFn as any)(refreshExpiresIn));

    const row = this.refreshTokensRepo.create({
      adminId: admin.id,
      tokenHash,
      expiresAt,
      revoked: false,
    });
    await this.refreshTokensRepo.save(row);

    return { accessToken, refreshToken };
  }

  private sanitizeAdmin(admin: Admin): Partial<Admin> {
    const { passwordHash: _passwordHash, ...rest } = admin;
    return rest;
  }
}
