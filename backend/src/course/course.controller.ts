/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from 'generated/prisma';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { RoleGuard } from 'src/roles/roles.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @UseGuards(RoleGuard(["LECTURER"]))
  @UseInterceptors(FileInterceptor('syllabus', {
    storage: diskStorage({
      destination: "./uploads/courses",
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `course-${uniqueSuffix}${ext}`;
        cb(null, filename)
      }
    })
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createCourse: Prisma.CourseUncheckedCreateInput) {
    const { filename } = file;
    const newCourse = { ...createCourse, lecturerId: Number(createCourse.lecturerId), credits: Number(createCourse.credits), syllabus: filename } as Prisma.CourseUncheckedCreateInput

    const created = await this.courseService.create(newCourse);
    if (created) {
      return { message: "Course created", id: created.id }
    }
    return created;
  }

  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get("student/:id")
  @UseGuards(RoleGuard(["STUDENT"]))
  async findCourseNotEnrolled(@Param("id") id: string) {
    return await this.courseService.findCourseToEnroll(+id);
  }

  @Get("enrolled/student/:id")
  @UseGuards(RoleGuard(["STUDENT"]))
  async findEnrolledCourse(@Param("id") id: string) {
    return await this.courseService.findEnrolledCourse(+id);
  }


  @Get('lecturer/:id')
  async findLecCourses(@Param('id') id: string) {
    return this.courseService.findLecCourses(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.courseService.findOne(+id);
  }
  @Patch('/lecturer/assign/:id')
  async updateLec(@Param('id') id: string, @Body() updateCourse: { lecturerId: number }) {
    const assigned = await this.courseService.assignLec(+id, updateCourse);
    if (assigned) {
      return { message: "Course Assigned", lecId: assigned.lecturerId }
    }
    return assigned;
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('syllabus', {
    storage: diskStorage({
      destination: "./uploads/courses",
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `course-${uniqueSuffix}${ext}`;
        cb(null, filename)
      }
    })
  }))

  @UseGuards(RoleGuard(["LECTURER", "ADMIN"]))
  async update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() updateCourse: Prisma.CourseUncheckedCreateInput) {
    const syllabus = file && file.filename;
    const title = updateCourse.title && updateCourse.title;
    const credits = updateCourse.credits && Number(updateCourse.credits);
    const newUpdate = {
      ...(title && { title }), ...(credits && { credits }),
      ...(syllabus && { syllabus }),
    };
    const updated = await this.courseService.update(+id, newUpdate)
    if (updated) {
      return { message: "Course updated", id: updated.id }
    }
    return updated
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.courseService.remove(+id);
    if (deleted) {
      return { message: "Course deleted", id: deleted.id }
    }
    return deleted;
  }
}
