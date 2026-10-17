import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { toPublicAdmin } from './admin-public';
import { AdminRole } from '../../common/enums';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(@InjectRepository(Admin) private adminsRepo: Repository<Admin>) {}

  async findAll(): Promise<Partial<Admin>[]> {
    const admins = await this.adminsRepo.find({ order: { createdAt: 'ASC' } });
    return admins.map((a) => toPublicAdmin(a));
  }

  async findOneOrFail(id: string): Promise<Admin> {
    const admin = await this.adminsRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async create(dto: CreateAdminDto): Promise<Partial<Admin>> {
    // There is exactly one Admin (created by the seed); everyone else is an
    // Employee. A lost Admin is recovered with the reset-admin script.
    if (dto.role === AdminRole.ADMIN) {
      throw new ForbiddenException('Only one Admin account is allowed');
    }
    const existing = await this.adminsRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const admin = this.adminsRepo.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
      role: AdminRole.EMPLOYEE,
    });
    await this.adminsRepo.save(admin);
    return toPublicAdmin(admin);
  }

  async update(
    id: string,
    dto: UpdateAdminDto,
    actorId: string,
  ): Promise<Partial<Admin>> {
    const admin = await this.findOneOrFail(id);
    if (
      id === actorId &&
      (dto.isActive === false || (dto.role && dto.role !== admin.role))
    ) {
      throw new ForbiddenException(
        'You cannot change your own role or deactivate your own account',
      );
    }
    if (dto.role === AdminRole.ADMIN && admin.role !== AdminRole.ADMIN) {
      throw new ForbiddenException('Only one Admin account is allowed');
    }
    if (dto.isActive === false) this.assertCanDeactivate(admin);
    if (dto.isActive === true) {
      admin.failedLoginAttempts = 0;
      admin.lockedUntil = null;
    }
    Object.assign(admin, dto);
    await this.adminsRepo.save(admin);
    return toPublicAdmin(admin);
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const admin = await this.findOneOrFail(id);
    admin.passwordHash = await bcrypt.hash(password, 10);
    admin.failedLoginAttempts = 0;
    admin.lockedUntil = null;
    await this.adminsRepo.save(admin);
  }

  async unlock(id: string): Promise<void> {
    const admin = await this.findOneOrFail(id);
    admin.failedLoginAttempts = 0;
    admin.lockedUntil = null;
    await this.adminsRepo.save(admin);
  }

  /** Only Employee accounts can be deactivated — never an Admin. */
  private assertCanDeactivate(target: Admin) {
    if (target.role === AdminRole.ADMIN) {
      throw new ForbiddenException('Only Employee accounts can be deactivated');
    }
  }

  async remove(id: string, actorId: string): Promise<void> {
    if (id === actorId) {
      throw new ForbiddenException('You cannot deactivate your own account');
    }
    const admin = await this.findOneOrFail(id);
    this.assertCanDeactivate(admin);
    admin.isActive = false;
    await this.adminsRepo.save(admin);
  }
}
