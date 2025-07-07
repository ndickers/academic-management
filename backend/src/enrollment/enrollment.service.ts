/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();
@Injectable()
export class EnrollmentService {
  create(enrollDetail: Prisma.EnrollmentCreateInput) {
    return prisma.enrollment.create({ data: enrollDetail });
  }

  async findAll() {
    return await prisma.enrollment.findMany({
      orderBy: [{
        id: "asc"
      }]
      ,
      include: {
        student: {
          select: {
            email: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  update(id: number, updateEnrollmentDto: any) {
    return `This action updates a #${id} enrollment`;
  }

  async dropEnrollment(studentId: number, courseId: number) {
    return await prisma.enrollment.delete({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });
  }
}
