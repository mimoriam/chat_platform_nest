import {
  CreateGroupMessageParams,
  DeleteGroupMessageParams,
  EditGroupMessageParams,
} from '../utils/types';
import { GroupMessage } from '../utils/typeorm';

export interface IGroupMessageService {
  createGroupMessage(params: CreateGroupMessageParams);

  getGroupMessages(id: number): Promise<GroupMessage[]>;

  editGroupMessage(params: EditGroupMessageParams): Promise<GroupMessage>;

  deleteGroupMessage(params: DeleteGroupMessageParams);
}
