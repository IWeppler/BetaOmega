import { IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone_number?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsUrl()
  @IsOptional()
  profile_image_url?: string;
}