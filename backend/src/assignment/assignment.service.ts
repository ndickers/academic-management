import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from 'generated/prisma';

const prisma = new PrismaClient();
@Injectable()
export class AssignmentService {
  async create(createAssignment: Prisma.AssignmentUncheckedCreateInput) {
    return await prisma.assignment.create({ data: createAssignment });
  }

  findAll() {
    return `This action returns all assignment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignment`;
  }

  update(id: number, updateAssignment: Prisma.AssignmentUpdateInput) {
    console.log(updateAssignment);

    return `This action updates a #${id} assignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignment`;
  }
}
