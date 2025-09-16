import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  goalAmount: number;
  @Prop({ default: 0 })
  currentAmount: number;
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;
  @Prop()
  imageUrl: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  ownerId: mongoose.Schema.Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
