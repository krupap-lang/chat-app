import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';

@Controller('messages')
export class ChatController {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  @Get(':roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.messageModel.find({ roomId }).sort({ createdAt: 1 }).exec();
  }
}