import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service'; // UsersService'i import et
import { User } from './schema/user.schema';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { } // UsersService'i inject et

  @Post()
  create(@Body() createUserDto: Partial<User>) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a user by ID' }) // Swagger açıklaması
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a user by ID' }) // Swagger açıklaması
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: Partial<User>) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a user by ID' }) // Swagger açıklaması
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
