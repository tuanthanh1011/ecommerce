import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentCategory } from '../../common/enums';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private documentsRepo: Repository<Document>,
  ) {}

  findAll(category?: DocumentCategory) {
    return this.documentsRepo.find({
      where: category ? { category } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findOneOrFail(id: string): Promise<Document> {
    const doc = await this.documentsRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async create(dto: CreateDocumentDto): Promise<Document> {
    const doc = this.documentsRepo.create(dto);
    return this.documentsRepo.save(doc);
  }

  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
    const doc = await this.findOneOrFail(id);
    Object.assign(doc, dto);
    return this.documentsRepo.save(doc);
  }

  async remove(id: string): Promise<void> {
    const doc = await this.findOneOrFail(id);
    await this.documentsRepo.remove(doc);
  }
}
