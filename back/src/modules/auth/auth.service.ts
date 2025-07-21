import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 📝 Registro general
  async registerUser(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ email: dto.email });
    if (existingUser) throw new ConflictException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepository.create({ ...dto, password: hashedPassword });
    return this.userRepository.save(newUser);
  }

  // 🔐 Login con email
  async login(dto: LoginDto): Promise<string> {
    const { email, password } = dto;
    const user = await this.userRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = this.createJwtPayload(user);
    return this.jwtService.sign(payload);
  }

  // 🔐 Login con Google
  async validateOrCreateGoogleUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }): Promise<string> {
    let user = await this.userRepository.findOneBy({ email: googleUser.email });
    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = this.userRepository.create({
        email: googleUser.email,
        first_name: googleUser.firstName,
        last_name: googleUser.lastName,
        password: randomPassword,
        role: UserRole.STUDENT,
      });
      await this.userRepository.save(user);
    }

    const payload = this.createJwtPayload(user);
    return this.jwtService.sign(payload);
  }

  private createJwtPayload(user: User) {
    return {
      sub: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone_number: user.phone_number,
      country: user.country,
    };
  }
}
