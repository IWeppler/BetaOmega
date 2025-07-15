import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository, In } from 'typeorm';

import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
// import { NotificationsService } from '../notifications/notifications.service'; //Steven
import { instanceToPlain } from 'class-transformer';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/entities/user.entity';
import AppDataSource from 'src/data.source';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  private getUserRepository(): Repository<User> {
    return AppDataSource.getRepository(User);
  }

  // 📝 Registro general
  async registerUser(dto: CreateUserDto): Promise<User> {
    const repo = this.getUserRepository();
    const existingUser = await repo.findOneBy({ email: dto.email });
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = repo.create({ ...dto, password: hashedPassword });
    return repo.save(newUser);
  }

  // 🔐 Login con email
  async login(dto: LoginDto): Promise<string> {
    const { email, password } = dto;
    const user = await this.getUserRepository().findOneBy({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = this.createJwtPayload(user);
    return this.jwtService.sign(payload);
  }

  // 🔐 Login con Google (si existe, entra; si no, se crea)
  async validateOrCreateGoogleUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }): Promise<string> {
    const repo = this.getUserRepository();

    let user = await repo.findOneBy({ email: googleUser.email });
    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = repo.create({
        email: googleUser.email,
        first_name: googleUser.firstName,
        last_name: googleUser.lastName,
        password: randomPassword,
        role: UserRole.STUDENT, // o ADMIN si lo determinás por lógica o dominio
      });
      await repo.save(user);
    }

    const payload = this.createJwtPayload(user);
    return this.jwtService.sign(payload);
  }

  private createJwtPayload(user: User) {

    return {
      sub: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      roles: [user.role],
    };
  }
}