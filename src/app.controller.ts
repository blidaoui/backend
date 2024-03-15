import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Delete,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { User } from './user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('nom') nom: string,
    @Body('prenom') prenom: string,
    @Body('tele') tele: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    console.log(nom,prenom,tele,email,password);

    const hashedPassword = await bcrypt.hash(password, 12);
    return this.appService.create({
      nom,
      prenom,
      tele,
      email,
      password: hashedPassword,
    });
  }
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.appService.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({ user_id: user.user_id });

    response.cookie('jwt', jwt, { httpOnly: true });
    return { message: 'success' };
  }
  @Get()
  async findAll(): Promise<User[]> {
    return await this.appService.findall();
  }

  @Get(':id')
  async findOne(@Param('user_id') user_id: number): Promise<User> {
    const user = await this.appService.findOne({where:{user_id}});
    if (!user) {
      throw new Error('User not found');
    } else {
      return user;
    }
  }
  //update user
  @Put(':user_id')
  async update(@Param('user_id') user_id: number, @Body() user: User): Promise<User> {
    return this.appService.update(user_id, user);
  }

  //delete user
  @Delete(':user_id')
  async delete(@Param('user_id') user_id: number): Promise<void> {
    //handle the error if user not found
    const user = await this.appService.findOne(user_id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.appService.delete(user_id);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    try {
      response.clearCookie('jwt');
      return { message: 'success' };
    } catch (e) {
      return { message: 'logout error:', e };
    }
  }
}
