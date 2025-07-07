/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();
@Injectable()
export class AuthService {
  async create(registerUser: Prisma.UserCreateInput) {
    return await prisma.user.create({ data: registerUser });
  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
  async getToken(token: string) {
    return await prisma.user.findUnique({
      where: {
        confirmationToken: token,
      },
    });
  }

  async verifyUser(token: string) {
    return await prisma.user.update({
      where: {
        confirmationToken: token,
      },
      data: {
        isVerified: true,
        confirmationToken: null
      },
    });
  }
}


