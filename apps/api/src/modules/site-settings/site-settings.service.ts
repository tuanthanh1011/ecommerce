import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import { UpdateContactSettingsDto } from './dto/update-contact-settings.dto';
import { UpdateHomeSettingsDto } from './dto/update-home-settings.dto';
import {
  UpdateInternalNoticesDto,
  UpdateInternalPeopleDto,
} from './dto/update-internal-pages.dto';
import {
  DEFAULT_INTERNAL_NOTICES,
  DEFAULT_INTERNAL_PEOPLE,
  InternalNotices,
  InternalPeople,
  sanitizeInternalNotices,
  sanitizeInternalPeople,
} from './internal-settings';
import {
  DEFAULT_HOME_SETTINGS,
  HomeSettings,
  sanitizeHomeSettings,
} from './home-settings';

const CONTACT_KEY = 'contact';
const HOME_KEY = 'home';
const INTERNAL_NOTICES_KEY = 'internal-notices';
const INTERNAL_PEOPLE_KEY = 'internal-people';
const CONTACT_FIELDS = [
  'phone',
  'openingHours',
  'closingMessage',
  'facebookUrl',
  'instagramUrl',
  'youtubeUrl',
  'tiktokUrl',
  'chatUrl',
] as const;

export type ContactSettings = Partial<
  Record<(typeof CONTACT_FIELDS)[number], string>
>;

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSetting)
    private settingsRepo: Repository<SiteSetting>,
  ) {}

  async getContact(): Promise<ContactSettings> {
    const row = await this.settingsRepo.findOne({
      where: { key: CONTACT_KEY },
    });
    return row?.value ?? {};
  }

  async updateContact(dto: UpdateContactSettingsDto): Promise<ContactSettings> {
    // Whitelist + trim; blank strings are dropped so "empty" means "hidden".
    const value: ContactSettings = {};
    for (const field of CONTACT_FIELDS) {
      const raw = dto[field]?.trim();
      if (raw) value[field] = raw;
    }
    const row =
      (await this.settingsRepo.findOne({ where: { key: CONTACT_KEY } })) ??
      this.settingsRepo.create({ key: CONTACT_KEY });
    row.value = value;
    await this.settingsRepo.save(row);
    return value;
  }

  /** Falls back to the defaults until an admin saves the home page for the first time. */
  async getHome(): Promise<HomeSettings> {
    const row = await this.settingsRepo.findOne({ where: { key: HOME_KEY } });
    return row ? sanitizeHomeSettings(row.value) : DEFAULT_HOME_SETTINGS;
  }

  async updateHome(dto: UpdateHomeSettingsDto): Promise<HomeSettings> {
    const value = sanitizeHomeSettings(dto);
    const row =
      (await this.settingsRepo.findOne({ where: { key: HOME_KEY } })) ??
      this.settingsRepo.create({ key: HOME_KEY });
    row.value = value as unknown as Record<string, unknown>;
    await this.settingsRepo.save(row);
    return value;
  }

  /** Falls back to the defaults until an admin saves the page for the first time. */
  async getInternalNotices(): Promise<InternalNotices> {
    const row = await this.settingsRepo.findOne({
      where: { key: INTERNAL_NOTICES_KEY },
    });
    return row ? sanitizeInternalNotices(row.value) : DEFAULT_INTERNAL_NOTICES;
  }

  async updateInternalNotices(
    dto: UpdateInternalNoticesDto,
  ): Promise<InternalNotices> {
    const value = sanitizeInternalNotices(dto);
    await this.save(INTERNAL_NOTICES_KEY, value);
    return value;
  }

  async getInternalPeople(): Promise<InternalPeople> {
    const row = await this.settingsRepo.findOne({
      where: { key: INTERNAL_PEOPLE_KEY },
    });
    return row ? sanitizeInternalPeople(row.value) : DEFAULT_INTERNAL_PEOPLE;
  }

  async updateInternalPeople(
    dto: UpdateInternalPeopleDto,
  ): Promise<InternalPeople> {
    const value = sanitizeInternalPeople(dto);
    await this.save(INTERNAL_PEOPLE_KEY, value);
    return value;
  }

  private async save(key: string, value: object): Promise<void> {
    const row =
      (await this.settingsRepo.findOne({ where: { key } })) ??
      this.settingsRepo.create({ key });
    row.value = value as Record<string, unknown>;
    await this.settingsRepo.save(row);
  }
}
