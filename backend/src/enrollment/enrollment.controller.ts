/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Prisma } from 'generated/prisma';
import { NotificationGateway } from '../notification/notification.gateway';


@Controller('enroll')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService, private readonly notificationGateway: NotificationGateway) { }

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
  async update(@Param('id') id: string, @Body() updateEnrollment: Prisma.EnrollmentUpdateInput) {
    try {
      const updated = await this.enrollmentService.update(+id, updateEnrollment);
      if (updated) {
        const message = updated.status === "APPROVED" ? `Congratulations! You have been approved to enroll in ${updated.course.title}` : `We're sorry. Your enrollment request for ${updated.course.title} was not approved`
        this.notificationGateway.sendEnrollMentNotification(updated.studentId, message)
        return { status: updated.status, id: updated.id }
      }
    } catch (error) {
      throw error
    }
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
