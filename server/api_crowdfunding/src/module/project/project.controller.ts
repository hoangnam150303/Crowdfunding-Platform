import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('createProject')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectService.create(createProjectDto, req.user, file);
  }

  @Get()
  findAll(
    @Query() query: Record<string, any>,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('search') search: string,
  ) {
    return this.projectService.findAll(query, +current, +pageSize, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
