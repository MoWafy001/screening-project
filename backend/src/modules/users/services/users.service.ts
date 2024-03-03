import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(user: Partial<User>): Promise<UserDocument> {
    return await this.userModel.create(user);
  }

  async updateOne(user: UserDocument, updateQuery: any): Promise<UserDocument> {
    Object.assign(user, updateQuery);
    return await user.save();
  }

  async findOne(query: any): Promise<UserDocument> {
    return await this.userModel.findOne(query);
  }

  async findByOrFail(query: any): Promise<UserDocument> {
    const user = await this.userModel.findOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id);
  }
}
