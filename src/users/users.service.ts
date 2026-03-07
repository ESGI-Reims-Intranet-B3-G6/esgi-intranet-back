import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PassportMicrosoftProfile } from '../auth/passport-microsoft-profile';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async createOrUpdateUser(user: PassportMicrosoftProfile): Promise<User> {
    const databaseUser = await this.userRepository.findOne({
      // TODO: the search for an existing user should use the user ID instead
      // of the UPN. This is disabled so that users can be added via their UPN
      // instead of requiring users to get the user's ID.
      // Whenever the application will be ran within the organization,
      // the backend will be able to retrieve the user ID from the UPN directly.
      //where: { id: user.id },
      where: { email: user.userPrincipalName },
      withDeleted: true,
    });

    if (databaseUser?.disabledAt) {
      throw new ForbiddenException('User is disabled');
    }

    const newUser: User = new User({
      id: user.id,
      email: user.userPrincipalName,
      firstName: user.name.givenName,
      lastName: user.name.familyName,
      lastLogin: new Date(),
      userRole: databaseUser?.userRole ? databaseUser.userRole : 'GUEST',
      refreshToken: null,
    });

    return await this.userRepository.save(newUser);
  }

  async createUser(user: Partial<User>) {
    const databaseUser = await this.userRepository.findOne({
      // TODO: the search for an existing user should use the user ID instead
      // of the UPN. This is disabled so that users can be added via their UPN
      // instead of requiring users to get the user's ID.
      // Whenever the application will be ran within the organization,
      // the backend will be able to retrieve the user ID from the UPN directly.
      //where: { id: user.id },
      where: { email: user.email },
      withDeleted: true,
    });

    if (databaseUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = new User(user);

    return await this.userRepository.save(newUser);
  }

  async isUserDisabled(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        disabledAt: Not(IsNull()),
      },
      withDeleted: true,
    });

    return !!user?.disabledAt;
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

  async listUsers(): Promise<User[]> {
    return await this.userRepository.find({ withDeleted: true });
  }
}
