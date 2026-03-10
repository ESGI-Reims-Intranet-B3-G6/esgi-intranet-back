import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Put,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { RequestNewsModificationsDto } from './dto/request-news-modifications.dto';
import { UserSuperAdminGuard } from '../users/guards/user-superadmin-guard';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: User, @Body() createNewsDto: CreateNewsDto) {
    return (await this.newsService.create(user, createNewsDto)).toPublic();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUserArticles(@CurrentUser() user: User) {
    return (await this.newsService.findByUser(user)).map((article) => article.toPublic());
  }

  @Get('list/')
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User) {
    if (user.userRole === 'ADMIN' || user.userRole === 'SUPERADMIN') {
      return (await this.newsService.findAll()).map((article) => article.toPublic());
    }

    return (await this.newsService.findAllForUser(user)).map((article) => article.toPublic());
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    const article = await this.newsService.findOne(+id);
    if (!article) {
      throw new NotFoundException('Article was not found');
    }
    if (user.userRole === 'ADMIN' || user.userRole === 'SUPERADMIN') {
      return article.toPublic();
    }
    if (!article.publishedAt && article.user?.email !== user.email) {
      throw new NotFoundException('Article was not found');
    }

    return article.toPublic();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto
  ) {
    const article = await this.newsService.findOne(+id);
    if (!article) {
      throw new NotFoundException('Article was not found');
    }

    if (article.user.email !== user.email) {
      throw new UnauthorizedException('You are not the author of this article');
    }

    if (article.publishedAt) {
      throw new BadRequestException('This article was already published');
    }

    return await this.newsService.update(+id, updateNewsDto);
  }

  @Put(':id/validate')
  @UseGuards(JwtAuthGuard, UserSuperAdminGuard)
  async validate(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.newsService.validate(+id);
  }

  @Put(':id/modifications')
  @UseGuards(JwtAuthGuard, UserSuperAdminGuard)
  async modifications(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: RequestNewsModificationsDto
  ) {
    return await this.newsService.modifications(+id, body.modifications);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserSuperAdminGuard)
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.newsService.remove(+id);
  }
}
