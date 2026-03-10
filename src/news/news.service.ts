import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NewsService {
  constructor(@InjectRepository(News) private readonly newsRepository: Repository<News>) {}

  async create(user: User, createNewsDto: CreateNewsDto) {
    const currentDate = new Date();
    const publishedAt = user.userRole === 'SUPERADMIN' ? currentDate : undefined;

    const article = new News({
      user: user,
      title: createNewsDto.title,
      content: createNewsDto.content,
      createdAt: currentDate,
      lastRevision: currentDate,
      publishedAt,
    });

    return await this.newsRepository.save(article);
  }

  async findAll() {
    return await this.newsRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findAllForUser(user: User) {
    return await this.newsRepository.find({
      relations: {
        user: true,
      },
      where: [{ publishedAt: Not(IsNull()) }, { user: user, publishedAt: IsNull() }],
    });
  }

  async findByUser(user: User) {
    return await this.newsRepository.findBy({ user });
  }

  async findOne(id: number) {
    return await this.newsRepository.findOne({ where: { id }, relations: { user: true } });
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    return await this.newsRepository.update(
      { id },
      { title: updateNewsDto.title, content: updateNewsDto.content, modificationsRequested: null }
    );
  }

  async validate(id: number) {
    const article = await this.findOne(id);
    if (!article || !!article.publishedAt) {
      throw new BadRequestException('Article was either not found or it was already published');
    }

    return await this.newsRepository.update(
      { id },
      { modificationsRequested: null, publishedAt: new Date() }
    );
  }

  async modifications(id: number, modifications: string) {
    const article = await this.findOne(id);
    if (!article || !!article.publishedAt) {
      throw new BadRequestException('Article was either not found or it was already published');
    }

    return await this.newsRepository.update({ id }, { modificationsRequested: modifications });
  }

  async remove(id: number) {
    return await this.newsRepository.delete({ id });
  }
}
