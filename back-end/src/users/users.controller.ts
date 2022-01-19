import { Controller, Get, Post,Put, Delete, Body, Param } from  '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from  '../entities/users.entity';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @Get()
    read(): Promise<Users[]> {
      return this.usersService.readAll();
    }
    
    @Post('create')
    async create(@Body() users: Users): Promise<any> {
      return this.usersService.create(users);
    }  
    
    @Put(':id/update')
    async update(@Param('id') id: number, @Body() users: Users): Promise<any> {
        users.id = Number(id);
        return this.usersService.update(users);
    }  
    
    @Delete(':id/delete')
    async delete(@Param('id') id: number): Promise<any> {
      return this.usersService.delete(id);
    }
}
