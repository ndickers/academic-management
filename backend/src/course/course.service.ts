/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class CourseService {
  async create(createCourse: Prisma.CourseUncheckedCreateInput) {
    return await prisma.course.create({ data: createCourse });
  }

  async findAll() {
    return await prisma.course.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
      include: {
        lecturer: {
          select: {
            email: true,
            id: true
          }
        }
      }
    });
  }

  async findCourseToEnroll(studentId: number) {
    return await prisma.course.findMany({
      where: {
        enrollments: {
          none: {
            studentId: studentId,
          }
        }
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  async findEnrolledCourse(studentId: number) {
    return await prisma.course.findMany({
      where: {
        enrollments: {
          some: {
            studentId: studentId,
          }
        }
      },
      include: {
        enrollments: {
          where: {
            studentId: studentId
          }, select: {
            id: true,
            status: true,
          },
        }
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  async findOne(id: number) {
    return await prisma.course.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findLecCourses(id: number) {
    return await prisma.course.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
      where: {
        lecturerId: id,
      },
    });
  }

  async update(id: number, updateCourse: Prisma.CourseUncheckedUpdateInput) {
    return await prisma.course.update({
      where: {
        id: id,
      },
      data: updateCourse,
    });
  }

  async assignLec(id: number, updateCourse: { lecturerId: number }) {
    return await prisma.course.update({
      where: {
        id: id,
      },
      data: updateCourse,
    });
  }

  async remove(id: number) {
    return await prisma.course.delete({
      where: {
        id: id,
      },
    });
  }
}

