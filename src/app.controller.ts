import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Put,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { Observable } from 'rxjs';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';

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
    const jwt = await this.jwtService.signAsync({ id: user.user_id });

    response.cookie('jwt', jwt, { httpOnly: true });
    return { message: 'success' };
  }
  // @Get('user')
  // async user(@Req() request: Request) {
  //   try {
  //     const cookie = request.cookies['jwt'];
  //     const data = await this.jwtService.verifyAsync(cookie);
  //     if (!data) {
  //       throw new UnauthorizedException('invalid credentials');
  //     }
  //     const user = await this.appService.findOne({
  //       where: { user_id: data['user_id'] },
  //     });

  //     const { password, ...result } = user;
  //     return result;
  //   } catch (e) {
  //     throw new UnauthorizedException();
  //   }
  // }
  @Get(':id')
  async findOne(@Param('user_id') user_id: number): Promise<User> {
    const user = await this.appService.findOne({wher: {user_id}});
    if (!user) {
      throw new Error('User not found');
    } else {
      return user;
    }
  }
  @Get()
  findAll():Observable<User[]>{
      return(this.appService.findAllUser())
  }

  @Put(':id')
  update(
      @Param('user_id') user_id:number,
      @Body() user:User 
  ):Observable<UpdateResult>{
      return(this.appService.updateUser(user_id,user))
  }

  @Delete(':user_id')
  delete(@Param('user_id') user_id:number){
      return(this.appService.deleteUser(user_id))
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
