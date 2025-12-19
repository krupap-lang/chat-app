import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  roomId: string; // The unique ID for socket rooms

  @Prop({ type: [String], required: true })
  members: string[]; // Array of User IDs
}

export const GroupSchema = SchemaFactory.createForClass(Group);