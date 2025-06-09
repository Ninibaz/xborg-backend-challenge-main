import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Calls
export const SignUpCall = 'SignUp';

// Payloads
export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
