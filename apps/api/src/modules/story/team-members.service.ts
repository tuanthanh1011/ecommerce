import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from './entities/team-member.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { ReorderTeamMembersDto } from './dto/reorder-team-members.dto';
import { TeamMemberGroup } from '../../common/enums';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(TeamMember)
    private teamMembersRepo: Repository<TeamMember>,
  ) {}

  findAll(group?: TeamMemberGroup) {
    return this.teamMembersRepo.find({
      where: group ? { group } : {},
      order: { sortOrder: 'ASC' },
    });
  }

  async findOneOrFail(id: string): Promise<TeamMember> {
    const member = await this.teamMembersRepo.findOne({ where: { id } });
    if (!member) throw new NotFoundException('Team member not found');
    return member;
  }

  async create(dto: CreateTeamMemberDto): Promise<TeamMember> {
    const count = await this.teamMembersRepo.count({
      where: { group: dto.group },
    });
    const member = this.teamMembersRepo.create({ ...dto, sortOrder: count });
    return this.teamMembersRepo.save(member);
  }

  async update(id: string, dto: UpdateTeamMemberDto): Promise<TeamMember> {
    const member = await this.findOneOrFail(id);
    Object.assign(member, dto);
    return this.teamMembersRepo.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findOneOrFail(id);
    await this.teamMembersRepo.remove(member);
  }

  async reorder(dto: ReorderTeamMembersDto): Promise<void> {
    await Promise.all(
      dto.items.map((item) =>
        this.teamMembersRepo.update(
          { id: item.id },
          { sortOrder: item.sortOrder },
        ),
      ),
    );
  }
}
