import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(@InjectRepository(Admin) private adminsRepo: Repository<Admin>) {}

  async findAll(): Promise<Partial<Admin>[]> {
    const admins = await this.adminsRepo.find({ order: { createdAt: 'ASC' } });
    return admins.map((a) => this.sanitize(a));
  }

  async findOneOrFail(id: string): Promise<Admin> {
    const admin = await this.adminsRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async create(dto: CreateAdminDto): Promise<Partial<Admin>> {
    const existing = await this.adminsRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const admin = this.adminsRepo.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
    });
    await this.adminsRepo.save(admin);
    return this.sanitize(admin);
  }

  async update(id: string, dto: UpdateAdminDto): Promise<Partial<Admin>> {
    const admin = await this.findOneOrFail(id);
    Object.assign(admin, dto);
    await this.adminsRepo.save(admin);
    return this.sanitize(admin);
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const admin = await this.findOneOrFail(id);
    admin.passwordHash = await bcrypt.hash(password, 10);
    await this.adminsRepo.save(admin);
  }

  async remove(id: string): Promise<void> {
    const admin = await this.findOneOrFail(id);
    admin.isActive = false;
    await this.adminsRepo.save(admin);
  }

  private sanitize(admin: Admin): Partial<Admin> {
    const { passwordHash: _passwordHash, ...rest } = admin;
    return rest;
  }
}
