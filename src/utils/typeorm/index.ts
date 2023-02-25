import { User } from './entities/User.entity';
import { Session } from './entities/Session.entity';
import { Conversation } from './entities/Conversation.entity';
import { Message } from './entities/Message.entity';
import { Group } from './entities/Group.entity';

const entities = [User, Session, Conversation, Message, Group];

export default entities;

export { User, Session, Conversation, Message, Group };
