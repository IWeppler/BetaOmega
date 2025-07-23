import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-role.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary'

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


// Ruta para cambiar la contraseña
@UseGuards(AuthGuard('jwt'))
@Post('me/change-password')
async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
  const user = req.user as any;
  return this.usersService.changePassword(user.id, dto.currentPassword, dto.newPassword);
}

// Ruta para subir la foto de perfil
@UseGuards(AuthGuard('jwt'))
@Post('me/avatar')
@UseInterceptors(FileInterceptor('file', {
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file) => {
      const userId = req.user.id; 
      return {
        folder: 'imageProfile',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `avatar-${userId}`, 
      };
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      cb(new Error('Solo se permiten imágenes'), false);
    } else {
      cb(null, true);
    }
  },
}))
async uploadImageProfile(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
  const user = req.user as any;
  const cloudinaryUrl = file.path;
  return this.usersService.updateImageProfile(user.id, cloudinaryUrl);
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Delete(':id')
deleteUser(@Param('id', ParseUUIDPipe) id: string) {
  return this.usersService.deleteUser(id);
}
}