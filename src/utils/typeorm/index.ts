import { User } from './entities/User.entity';
import { Session } from './entities/Session.entity';
import { Conversation } from './entities/Conversation.entity';
import { Message } from './entities/Message.entity';
import { Group } from './entities/Group.entity';
import { GroupMessage } from './entities/GroupMessage.entity';

const entities = [User, Session, Conversation, Message, Group, GroupMessage];

export default entities;

export { User, Session, Conversation, Message, Group, GroupMessage };
