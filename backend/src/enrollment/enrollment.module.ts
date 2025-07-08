/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService, NotificationGateway],
})
export class EnrollmentModule { }
