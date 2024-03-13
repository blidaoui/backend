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
findAllUser():Observable<User[]>{
   return from(this.userRepository.find())
}
updateUser(user_id:number,user:User):Observable<UpdateResult>{
   return from(this.userRepository.update(user_id,user));
}
deleteUser(user_id:number):Observable<DeleteResult>{
   return from(this.userRepository.delete(user_id));
}
}
