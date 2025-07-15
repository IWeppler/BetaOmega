import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-role.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Request } from 'express';
/* import { ChangePasswordDto } from './dto/change-password.dto'; */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req.user as any;
    return this.usersService.updateUser(user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/role')
  updateRole(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() dto: UpdateUserRoleDto,
  ) {
   return this.usersService.updateUserRole(id, dto.role);
  }

/*   @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
  const user = req.user as any;
  return this.usersService.changePassword(user.id, dto.currentPassword, dto.newPassword);
} */
}
