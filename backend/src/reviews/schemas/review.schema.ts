import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ _id: false })
class AuthorSnapshot {
  @Prop({ required: true }) name: string;
  @Prop({ default: '' }) avatar: string;
}

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, trim: true })
  comment: string;

  @Prop({ required: true, enum: ['listing', 'experience'] })
  type: string;

  @Prop({ type: AuthorSnapshot, required: true })
  authorSnapshot: AuthorSnapshot;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, refPath: 'targetModel' })
  targetId: Types.ObjectId;

  @Prop({ required: true, enum: ['Listing', 'Experience'] })
  targetModel: string;

  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  bookingId: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
