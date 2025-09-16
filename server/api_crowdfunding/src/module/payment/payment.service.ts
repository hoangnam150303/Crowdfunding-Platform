import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import * as crypto from 'crypto';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from '../project/project.service';
function rfc3986Encode(str: string) {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase(),
  );
}
function sortObject<T extends Record<string, any>>(obj: T): T {
  const sorted: any = {};
  Object.keys(obj)
    .sort()
    .forEach((k) => (sorted[k] = obj[k]));
  return sorted;
}
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private readonly projectService: ProjectService,
    private readonly configService: ConfigService,
  ) {}
  async create(dto: CreatePaymentDto, ipAddr: string, user: any, id: string) {
    const amount = Number(dto.amount);
    const validPayment = await this.paymentModel.findOne({
      ownerId: user.userId,
      projectId: id,
    });
    if (validPayment) {
      throw new BadRequestException('You have already supported this project');
    }
    try {
      const payment = await this.paymentModel.create({
        amount,
        ownerId: user.userId,
        projectId: id,
      });
      await this.projectService.updateCurrentAmount(id, amount);
      try {
        if (!amount || amount <= 0)
          throw new BadRequestException('Invalid amount');
        if (!payment._id) throw new BadRequestException('Missing orderId');
        const returnUrl = this.configService.get<string>('FE_URL');

        const tmnCode = this.configService.get<string>('TMN_CODE');
        const secretKey = this.configService.get<string>('VNPAY_SECRETKEY');
        const vnpUrlBase = this.configService.get<string>('VNP_URL');
        if (!tmnCode || !secretKey || !vnpUrlBase) {
          throw new InternalServerErrorException(
            'Missing VNPay environment variables',
          );
        }

        const createDate = moment().format('YYYYMMDDHHmmss');
        const invoiceInfo = `Thanh toan cho ma GD:${moment().format('DDHHmmss')}`;

        let vnp_Params: Record<string, string> = {
          vnp_Version: '2.1.0',
          vnp_Command: 'pay',
          vnp_TmnCode: tmnCode,
          vnp_Locale: 'vn',
          vnp_CurrCode: 'VND',
          vnp_TxnRef: String(payment._id),
          vnp_OrderInfo: invoiceInfo,
          vnp_OrderType: 'other',
          vnp_Amount: String(Math.round(amount) * 100),
          vnp_ReturnUrl: returnUrl.split('?')[0],
          vnp_IpAddr: ipAddr || '0.0.0.0',
          vnp_CreateDate: createDate,
        };

        vnp_Params['vnp_BankCode'] = this.configService.get<string>('BANKCODE');

        vnp_Params = sortObject(vnp_Params);

        const signData = Object.keys(vnp_Params)
          .map((k) => `${k}=${rfc3986Encode(vnp_Params[k])}`)
          .join('&');

        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac
          .update(Buffer.from(signData, 'utf-8'))
          .digest('hex');

        vnp_Params['vnp_SecureHash'] = signed;

        const paymentUrl =
          vnpUrlBase +
          '?' +
          Object.keys(vnp_Params)
            .map((k) => `${k}=${rfc3986Encode(vnp_Params[k])}`)
            .join('&');
        return { paymentUrl, txnRef: payment._id };
      } catch (error) {}
    } catch (error) {
      throw new Error('Failed to create payment: ' + error.message);
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
