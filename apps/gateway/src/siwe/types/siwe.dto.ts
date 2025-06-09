import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetNonceDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  address: string;
}
