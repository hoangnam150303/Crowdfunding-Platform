import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':id')
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: ExpressRequest,
    @Request() request,
    @Param('id') id: string,
  ) {
    // Lấy IP chuẩn: ưu tiên x-forwarded-for (phần tử đầu), fallback req.ip
    const xff = (req.headers['x-forwarded-for'] as string) || '';
    const clientIp =
      (xff.split(',')[0] || '').trim() ||
      (req.ip || '').replace('::ffff:', '') ||
      (req.socket?.remoteAddress || '').replace('::ffff:', '');

    return this.paymentService.create(
      createPaymentDto,
      clientIp,
      request.user,
      id,
    );
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
