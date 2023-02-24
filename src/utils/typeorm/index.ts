import { User } from './entities/User.entity';
import { Session } from './entities/Session.entity';
import { Conversation } from './entities/Conversation.entity';
import { Participant } from './entities/Participant.entity';

const entities = [User, Session, Conversation, Participant];

export default entities;

export { User, Session, Conversation, Participant };
