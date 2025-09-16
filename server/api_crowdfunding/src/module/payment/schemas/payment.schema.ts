import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
  @Prop()
  amount: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  ownerId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  projectId: mongoose.Schema.Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
