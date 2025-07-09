/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { Prisma } from 'generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';



@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./uploads/assignment",
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `assignment-${uniqueSuffix}${ext}`;
        cb(null, filename)
      }
    })
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() data: Prisma.AssignmentUncheckedCreateInput) {
    const createDetails = { courseId: Number(data.courseId), studentId: Number(data.studentId), file: file.filename }
    try {
      const created = await this.assignmentService.create(createDetails);
      if (created) {
        return { message: "Assignment Submitted", id: created.id }
      }
    } catch (error) {
      if (error) {
        throw error
      }
    }
  }

  @Get()
  findAll() {
    return this.assignmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAssignmentDto: Prisma.AssignmentUpdateInput) {
  //   return this.assignmentService.update(+id, updateAssignmentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(+id);
  }
}
