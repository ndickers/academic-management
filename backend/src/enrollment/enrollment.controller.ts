/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Prisma } from 'generated/prisma';


@Controller('enroll')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) { }

  @Post()
  async create(@Body() createEnroll: Prisma.EnrollmentCreateInput) {
    const enroll = await this.enrollmentService.create(createEnroll);
    if (enroll) {
      return {
        message: "Enroollment successfull", id: enroll.id
      }
    }
    return enroll;
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentDto: any) {
    return this.enrollmentService.update(+id, updateEnrollmentDto);
  }

  @Delete(':studentId/:courseId')
  async remove(@Param('studentId') studentId: string,
    @Param('courseId') courseId: string) {
    try {
      const deleted = await this.enrollmentService.dropEnrollment(+studentId, +courseId);
      if (deleted) {
        return ({ message: "Dropped successfully", id: deleted.id })
      }
    } catch (error) {
      if (error) {
        throw error
      }
    }

  }
}
