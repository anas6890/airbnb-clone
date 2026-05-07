import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
class NotificationPrefs {
  @Prop({ default: true }) email: boolean;
  @Prop({ default: true }) sms: boolean;
  @Prop({ default: false }) marketing: boolean;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: false })
  isHost: boolean;

  @Prop({ type: NotificationPrefs, default: () => ({}) })
  notificationPrefs: NotificationPrefs;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Listing' }], default: [] })
  wishlistIds: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
