import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Observable, from } from 'rxjs';

@Injectable()
export class AppService {
 constructor(
  @InjectRepository(User) private readonly userRepository: Repository<User>
 ){}
 async create(date:any) :Promise<User>{
  return this.userRepository.save(date);
 }
 async findOne(condition:any):Promise<User>{
    return this.userRepository.findOne(condition);
 }
 async findall(): Promise<User[]> {
   return await this.userRepository.find();
 }
   // update user
   async update(user_id: number, user: User): Promise<User> {
      await this.userRepository.update(user_id, user);
      return await this.userRepository.findOne( { where : { user_id } } );
    }  
    // delete user
    async delete(user_id: number): Promise<void> {
      await this.userRepository.delete(user_id);
    }

}
