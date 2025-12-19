import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { AuthDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    const { email, password, name } = dto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ 
      name, 
      email, 
      password: hashedPassword 
    });
    
    await user.save();
    return { message: 'User registered successfully' };
  }

  async login(dto: AuthDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user._id, name: user.name };
    
    return {
      access_token: this.jwtService.sign(payload),
      userId: user._id,
      email: user.email,
      name: user.name, 
    };
  }

  async findAllUsers() {
    return this.userModel.find().select('-password').exec();
  }
}