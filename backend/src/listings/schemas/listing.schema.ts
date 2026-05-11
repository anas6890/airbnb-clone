import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ListingDocument = Listing & Document;

@Schema({ _id: false })
class Location {
  @Prop({ required: true }) address: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) country: string;
  @Prop() lat: number;
  @Prop() lng: number;
}

@Schema({ _id: false })
class HouseRules {
  @Prop({ default: false }) petsAllowed: boolean;
  @Prop({ default: false }) smokingAllowed: boolean;
  @Prop({ default: false }) partiesAllowed: boolean;
  @Prop({ default: 14 }) checkInTime: number;
  @Prop({ default: 11 }) checkOutTime: number;
}

@Schema({ _id: false })
class AvailabilityWindow {
  @Prop({ required: true }) from: Date;
  @Prop({ required: true }) to: Date;
}

@Schema({ timestamps: true })
export class Listing {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ['apartment', 'house', 'villa', 'cabin', 'studio', 'other'],
  })
  type: string;

  @Prop({ required: true, min: 0 })
  pricePerNight: number;

  @Prop({ required: true, min: 1 })
  maxGuests: number;

  @Prop({ type: Location, required: true })
  location: Location;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: HouseRules, default: () => ({}) })
  houseRules: HouseRules;

  @Prop({ type: [AvailabilityWindow], default: [] })
  availability: AvailabilityWindow[];

  @Prop({ required: true })
  bedrooms: number;

  @Prop({ required: true })
  beds: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  hostId: Types.ObjectId;

  @Prop({ default: 0, min: 0, max: 5 })
  avgRating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
