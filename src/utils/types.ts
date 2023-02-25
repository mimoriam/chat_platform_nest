import { Conversation, Group, GroupMessage, Message, User } from './typeorm';

export type CreateUserDetails = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ValidateUserDetails = {
  email: string;
  password: string;
};

export type FindUserParams = Partial<{
  id: number;
  email: string;
}>;

export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;

export type CreateConversationParams = {
  email: string;
  message: string;
};

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type CreateMessageParams = {
  content: string;
  conversationId: number;
  user: User;
};

export type CreateMessageResponse = {
  message: Message;
  conversation: Conversation;
};

export type DeleteMessageParams = {
  userId: number;
  conversationId: number;
  messageId: number;
};

export type EditMessageParams = {
  conversationId: number;
  messageId: number;
  userId: number;
  content: string;
};

export type CreateGroupParams = {
  creator: User;
  title?: string;
  users: string[];
};

export type FetchGroupsParams = {
  userId: number;
};

export type CreateGroupMessageParams = {
  groupId: number;
  content: string;
  author: User;
};

export type CreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};

export type EditGroupMessageParams = {
  groupId: number;
  messageId: number;
  userId: number;
  content: string;
};

export type DeleteGroupMessageParams = {
  userId: number;
  groupId: number;
  messageId: number;
};
