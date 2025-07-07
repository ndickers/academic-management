import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailServiceService } from './mail-service/mail-service.service';
import { CourseModule } from './course/course.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UsersController } from './users/users.controller';
import { CourseController } from './course/course.controller';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
  imports: [UsersModule, AuthModule, CourseModule, EnrollmentModule],
  controllers: [AppController],
  providers: [AppService, UsersService, MailServiceService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController, CourseController);
  }
}
