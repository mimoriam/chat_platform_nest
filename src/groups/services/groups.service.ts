import { Inject, Injectable } from '@nestjs/common';
import { IGroupService } from '../interfaces/groupsInterface';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, User } from '../../utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../../utils/constants';
import { IUserService } from '../../users/userInterface';
import {
  AccessParams,
  CreateGroupParams,
  FetchGroupsParams,
} from '../../utils/types';
import { GroupNotFoundException } from '../exceptions/GroupNotFound';

@Injectable()
export class GroupsService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}

  async createGroup(params: CreateGroupParams) {
    const { creator, title } = params;

    const usersPromise = params.users.map((email) =>
      this.userService.findOneUser({ email }),
    );

    const users = (await Promise.all(usersPromise)).filter((user) => user);

    users.push(creator);

    const group = this.groupRepository.create({ users, creator, title });
    return this.groupRepository.save(group);
  }

  async getGroups(params: FetchGroupsParams): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:...users)', { users: [params.userId] })
      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('group.creator', 'creator')
      .getMany();
  }

  async findGroupById(id: number): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['creator', 'users', 'lastMessageSent'],
    });
  }

  async saveGroup(group: Group): Promise<Group> {
    return this.groupRepository.save(group);
  }

  async hasAccess({ id, userId }: AccessParams): Promise<User | undefined> {
    const group = await this.findGroupById(id);
    if (!group) throw new GroupNotFoundException();
    return group.users.find((user) => user.id === userId);
  }
}
