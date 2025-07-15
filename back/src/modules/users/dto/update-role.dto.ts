import { IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserRoleDto {
  @IsEnum(UserRole, {
    message: 'Role must be either "admin" or "student"',
  })
  role: UserRole;
}