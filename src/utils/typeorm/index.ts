import { User } from './entities/User.entity';
import { Session } from './entities/Session.entity';
import { Conversation } from './entities/Conversation.entity';
import { Message } from './entities/Message';

const entities = [User, Session, Conversation, Message];

export default entities;

export { User, Session, Conversation, Message };
