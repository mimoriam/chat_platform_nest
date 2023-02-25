import { Entity, ManyToOne } from 'typeorm';
import { BaseMessage } from './BaseMessage.entity';
import { Group } from './Group.entity';

@Entity({ name: 'group_messages' })
export class GroupMessage extends BaseMessage {
  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;
}
