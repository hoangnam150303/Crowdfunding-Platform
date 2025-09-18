import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { hashPasswordHelper } from '@/helpers/passwordHelpers';
import { v4 as uuidv4 } from 'uuid';
import dayjs = require('dayjs');
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private mailerService: MailerService,
  ) {}
  async isMailExist(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (user) return true;
    return false;
  }
  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const emailValid = await this.isMailExist(email);
    if (emailValid) {
      throw new Error('Email already exists');
    }
    const codeId = uuidv4();
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(1, 'hour'),
    });
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Welcome to Our Service', // Subject line
      text: 'welcome', // plaintext body
      template: 'register',
      context: {
        name: user.name || user.email,
        activationCode: codeId,
      },
    });
    return {
      _id: user._id,
    };
  }
  async createUserOAuth(userDto: any) {
    try {
      console.log(userDto);
      const { email, name, avatar } = userDto;
      const emailValid = await this.isMailExist(email);
      if (emailValid) throw new BadRequestException('Email already exists');
      await this.userModel.create({
        name,
        email,
        avatar,
        isActive: true,
        accountType: 'GOOGLE',
      });
      return 'success';
    } catch (error) {
      return error;
    }
  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  /**
   * This function finds a user by their email address.
   * @param email string
   * @returns
   */
  async findByEmail(email: string) {
    try {
      const validUser = await this.userModel.findOne({ email: email });
      return validUser;
    } catch (error) {
      return error;
    }
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async activate(body) {
    try {
      const { codeId, email } = body;
      const user = await this.findByEmail(email);
      if (!user) throw new Error('User not found');
      if (user.isActive) throw new Error('Account is already active');
      if (user.codeId !== codeId) throw new Error('Invalid activation code');
      if (user.codeExpired < new Date())
        throw new Error('Activation code has expired');
      await this.userModel.updateOne({ _id: user._id }, { isActive: true });
      return { message: 'Account activated successfully' };
    } catch (error) {
      return { message: error.message || 'Activation failed' };
    }
  }
}
