import { IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserRoleDto {
  @IsEnum(UserRole, {
    message: 'El rol debe ser "admin" o "estudiante"',
  })
  role: UserRole;
}