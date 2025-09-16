import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';
import mongoose from 'mongoose';

export class CreatePaymentDto {
  @Type(() => Number) // ép "10000" -> 10000
  @IsNumber()
  @Min(1)
  amount: number;
}
