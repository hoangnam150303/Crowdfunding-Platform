import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/project.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import aqp from 'api-query-params';
@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(
    createProjectDto: CreateProjectDto,
    user: any,
    file: Express.Multer.File,
  ) {
    try {
      const { name, description, goalAmount, startDate, endDate } =
        createProjectDto;
      const ownerId = user.userId;
      const image = await this.cloudinaryService.uploadImageBuffer(
        file.buffer,
        'Crowdfunding/projects',
      );
      await this.projectModel.create({
        name,
        description,
        goalAmount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ownerId,
        imageUrl: image.secure_url,
      });
      return 'success';
    } catch (error) {
      throw new Error('Failed to create project: ' + error.message);
    }
  }

  async findAll(
    query: Record<string, any>,
    current?: number,
    pageSize?: number,
    search?: string,
  ) {
    try {
      const { filter = {}, sort = {} } = aqp(query);

      if (filter.current) delete filter.current;
      if (filter.pageSize) delete filter.pageSize;
      if (filter.search) delete filter.search;

      if (search && search.trim() !== '') {
        filter.name = { $regex: search, $options: 'i' };
      }

      current = current && current > 0 ? current : 1;
      pageSize = pageSize && pageSize > 0 ? pageSize : 10;
      const skip = (current - 1) * pageSize;
      const totalItems = await this.projectModel.countDocuments(filter).exec();
      const totalPages = Math.ceil(totalItems / pageSize);

      const result = await this.projectModel
        .find(filter)
        .populate('ownerId', 'email name image')
        .sort(sort as any)
        .skip(skip)
        .limit(pageSize)
        .exec();

      return {
        meta: { totalItems, totalPages, current, pageSize },
        data: result,
      };
    } catch (error) {
      throw new Error('Failed to get projects: ' + error.message);
    }
  }

  findOne(id: string) {
    try {
      const project = this.projectModel.findById(id).exec();
      return project;
    } catch (error) {
      throw new Error('Failed to get project: ' + error.message);
    }
  }

  updateCurrentAmount(id: string, amount) {
    try {
      const project = this.projectModel
        .findByIdAndUpdate(id, {
          $inc: { currentAmount: amount },
        })
        .exec();
      return project;
    } catch (error) {
      throw new Error('Failed to update project: ' + error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
