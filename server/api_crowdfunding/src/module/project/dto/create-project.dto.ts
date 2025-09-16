import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  goalAmount: number;
  @IsNotEmpty()
  startDate: Date;
  @IsNotEmpty()
  endDate: Date;
}
