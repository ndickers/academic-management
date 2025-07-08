/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from 'generated/prisma';
import { RoleGuard } from 'src/roles/roles.guard';

@Controller('users')

export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UseGuards(RoleGuard(["ADMIN"]))
  async create(@Body() newUser: Prisma.UserCreateInput) {
    return await this.usersService.create(newUser);
  }

  @Get()
  @UseGuards(RoleGuard(["ADMIN", "LECTURER"]))
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get("lecturer/:id")
  @UseGuards(RoleGuard(["ADMIN", "LECTURER"]))
  async findAllLec(@Param('id') exeptId: string) {
    return await this.usersService.findAllLec(+exeptId);
  }

  @Get(':id')
  @UseGuards(RoleGuard(["ADMIN", "LECTURER", "STUDENT"]))
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(RoleGuard(["ADMIN", "LECTURER", "STUDENT"]))
  async update(@Param('id') id: string, @Body() updateUser: Prisma.UserUpdateInput) {
    return await this.usersService.update(+id, updateUser);
  }

  @Delete(':id')

  async delete(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
