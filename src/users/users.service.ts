import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PassportMicrosoftProfile } from '../auth/passport-microsoft-profile';
import { isLowerPriority, isHigherPriority, Role, isEqualPriority } from './types/role.type';
import { EditUserId } from './dto';

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
      group: databaseUser?.group,
      refreshToken: null,
    });

    return await this.userRepository.save(newUser);
  }

  async enableUsersByEmail(userEmails: EditUserId[], currentUser: User) {
    const userPromises = userEmails.map(async (userId) => await this.getUserByEmail(userId.email));
    const resolvedUsers = await Promise.all(userPromises);
    if (resolvedUsers.some((user) => user === null)) {
      throw new NotFoundException('One of the users was not found');
    }

    const users = resolvedUsers as User[];

    const containsHigherPriorityEnable = users.some((user) =>
      isHigherPriority(user.userRole, currentUser.userRole)
    );
    const containsSamePriorityEnable = users.some((user) =>
      isEqualPriority(user.userRole, currentUser.userRole)
    );

    if (
      currentUser.userRole === 'ADMIN' &&
      (containsSamePriorityEnable || containsHigherPriorityEnable)
    ) {
      throw new ForbiddenException('Only Superadmins can enable Admins or Superadmins');
    }

    for (const user of users) {
      await this.enableUser(user.email);
    }
  }

  async disableUsersByEmail(userEmails: EditUserId[], currentUser: User) {
    const userPromises = userEmails.map(async (userId) => await this.getUserByEmail(userId.email));
    const resolvedUsers = await Promise.all(userPromises);
    if (resolvedUsers.some((user) => user === null)) {
      throw new NotFoundException('One of the users was not found');
    }

    const users = resolvedUsers as User[];

    const containsHigherPriorityDisable = users.some((user) =>
      isHigherPriority(currentUser.userRole, user.userRole)
    );
    const containsSamePriorityDisable = users.some((user) =>
      isEqualPriority(currentUser.userRole, user.userRole)
    );

    if (
      currentUser.userRole === 'ADMIN' &&
      (containsSamePriorityDisable || containsHigherPriorityDisable)
    ) {
      throw new ForbiddenException('Only Superadmins can disable Admins or Superadmins');
    }

    for (const user of users) {
      await this.disableUser(user.email);
    }
  }

  async editUsersByEmail(
    userEmails: EditUserId[],
    targetGroup: string,
    targetUserRole: Role,
    currentUser: User
  ) {
    const userPromises = userEmails.map(async (userId) => await this.getUserByEmail(userId.email));
    const resolvedUsers = await Promise.all(userPromises);
    if (resolvedUsers.some((user) => user === null)) {
      throw new NotFoundException('One of the users was not found');
    }

    const users = resolvedUsers as User[];

    const containsPromotion = users.some((user) => isHigherPriority(user.userRole, targetUserRole));
    const containsDemotion = users.some((user) => isLowerPriority(user.userRole, targetUserRole));

    // Allow the admin to demote themselves
    if (
      currentUser.userRole === 'ADMIN' &&
      users.length === 1 &&
      users[0].email === currentUser.email &&
      containsDemotion
    ) {
      await this.promoteOrDemoteUser(currentUser.email, targetUserRole);
      return;
    }

    if (
      currentUser.userRole === 'ADMIN' &&
      containsDemotion &&
      users.some((user) => user.userRole === 'ADMIN' || user.userRole === 'SUPERADMIN')
    ) {
      throw new ForbiddenException('Only Superadmins can demote users to Admin or Superadmin');
    }

    if (
      currentUser.userRole === 'ADMIN' &&
      containsPromotion &&
      (targetUserRole === 'ADMIN' || targetUserRole === 'SUPERADMIN')
    ) {
      throw new ForbiddenException('Only Superadmins can promote users to Admin or Superadmin');
    }

    // If an admin tries to update another admin / superadmin
    if (
      currentUser.userRole === 'ADMIN' &&
      users.some(
        (user) =>
          user.email !== currentUser.email &&
          (user.userRole === 'ADMIN' || user.userRole === 'SUPERADMIN')
      )
    ) {
      throw new ForbiddenException('Only Superadmins can edit other Admins or Superadmins');
    }

    for (const user of users) {
      await this.updateUser(user.email, targetUserRole, targetGroup);
    }
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
      await this.enableUser(databaseUser.email);
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

  async getUserByEmail(userEmail: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: userEmail }, withDeleted: true });
  }

  private async disableUser(userEmail: string): Promise<void> {
    await this.userRepository.softDelete({ email: userEmail });
  }

  private async enableUser(userEmail: string): Promise<void> {
    await this.userRepository.restore({ email: userEmail });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userRepository.update({ id: userId }, { refreshToken });
  }

  private async updateUser(userEmail: string, userRole?: Role, group?: string): Promise<void> {
    await this.userRepository.update({ email: userEmail }, { userRole, group });
  }

  private async promoteOrDemoteUser(userEmail: string, userRole?: Role): Promise<void> {
    await this.userRepository.update({ email: userEmail }, { userRole });
  }

  async listUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
