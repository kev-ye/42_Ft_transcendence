import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, UpdateResult, DeleteResult } from  'typeorm';
import { Users } from  '../entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
    ) {}

    async create(users: Users): Promise<Users> {
      return await this.usersRepository.save(users);
    }
    
    async  readAll(): Promise<Users[]> {
      return await this.usersRepository.find();
    }

    async update(users: Users): Promise<UpdateResult> {
      return await this.usersRepository.update(users.id,users);
    }

    async delete(id: number): Promise<DeleteResult> {
      return await this.usersRepository.delete(id);
    }
}
