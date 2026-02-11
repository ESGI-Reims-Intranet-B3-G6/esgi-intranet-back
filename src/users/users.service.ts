import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PassportMicrosoftProfile } from '../auth/passport-microsoft-profile';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async createOrUpdateUser(user: PassportMicrosoftProfile): Promise<User> {
    const newUser: User = {
      id: user.id,
      email: user.userPrincipalName,
      firstName: user.name.givenName,
      lastName: user.name.familyName,
      lastLogin: new Date(),
      refreshToken: null,
    };

    const disabledUserTest = await this.userRepository.findOne({
      where: { id: user.id, disabledAt: Not(IsNull()) },
      withDeleted: true,
    });

    if (disabledUserTest) {
      throw new ForbiddenException('User is disabled');
    }

    return await this.userRepository.save(newUser);
  }

  async getUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id: userId });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.softDelete({ id: userId });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userRepository.update({ id: userId }, { refreshToken });
  }
}
