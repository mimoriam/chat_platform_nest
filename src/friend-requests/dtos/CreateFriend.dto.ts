import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateFriendDto {
  @IsNotEmpty()
  username: string;
}
