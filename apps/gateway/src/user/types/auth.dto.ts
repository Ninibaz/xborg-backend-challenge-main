import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthResponseDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  signature: string;

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
