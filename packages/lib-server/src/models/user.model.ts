import { IsEmail, IsOptional, IsString } from 'class-validator';

// Calls
export const GetUserCall = 'GetUser';

// Payloads
export class GetUserDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UserDTO {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
