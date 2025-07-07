/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailServiceService } from 'src/mail-service/mail-service.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MailServiceService],
})
export class AuthModule { }
