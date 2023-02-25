import { Inject, Injectable } from '@nestjs/common';
import { IGroupService } from './groupsInterface';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../utils/constants';
import { IUserService } from '../users/userInterface';
import { CreateGroupParams, FetchGroupsParams } from '../utils/types';

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
      .getMany();
  }

  async getGroupById(id: number): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['creator', 'users', 'lastMessageSent'],
    });
  }
}
