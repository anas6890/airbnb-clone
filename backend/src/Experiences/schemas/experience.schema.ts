import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExperienceDocument = Experience & Document;

@Schema({ _id: false })
class ExperienceLocation {
  @Prop({ required: true }) address: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) country: string;
  @Prop() lat: number;
  @Prop() lng: number;
}

@Schema({ _id: false })
class ScheduleSlot {
  @Prop({ required: true }) date: Date;
  @Prop({ required: true }) startTime: string;
  @Prop({ required: true }) endTime: string;
  @Prop({ default: 0 }) bookedSpots: number;
}

@Schema({ timestamps: true })
export class Experience {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({
    required: true,
    enum: ['outdoor', 'food', 'art', 'music', 'sport', 'culture', 'other'],
  })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  duration: number;

  @Prop({ required: true, min: 0 })
  pricePerPerson: number;

  @Prop({ required: true, min: 1 })
  maxGroupSize: number;

  @Prop({ type: [ScheduleSlot], default: [] })
  schedule: ScheduleSlot[];

  @Prop({ type: ExperienceLocation, required: true })
  location: ExperienceLocation;

  @Prop({ type: [String], default: [] })
  included: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  hostId: Types.ObjectId;

  @Prop({ default: 0, min: 0, max: 5 })
  avgRating: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
