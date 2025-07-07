import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();
@Injectable()
export class UsersService {
  async create(newUser: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data: newUser,
    });
  }

  async findAll() {
    return await prisma.user.findMany();
  }

  async findOne(userId: number) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async update(id: number, updateUser: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: updateUser,
    });
  }

  async remove(id: number) {
    return await prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
