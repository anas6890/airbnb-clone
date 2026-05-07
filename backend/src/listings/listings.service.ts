import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing, ListingDocument } from './schemas/listing.schema';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
  ) {}

  async create(dto: CreateListingDto): Promise<ListingDocument> {
    const listing = new this.listingModel(dto);
    return listing.save();
  }

  async findAll(city?: string): Promise<ListingDocument[]> {
    const filter: Record<string, any> = { isAvailable: true };
    if (city) filter['location.city'] = new RegExp(city, 'i');
    return this.listingModel
      .find(filter)
      .populate('hostId', 'name email avatar');
  }

  async findOne(id: string): Promise<ListingDocument> {
    const listing = await this.listingModel
      .findById(id)
      .populate('hostId', 'name email avatar');
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async update(
    id: string,
    dto: Partial<CreateListingDto>,
  ): Promise<ListingDocument> {
    const listing = await this.listingModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async remove(id: string): Promise<void> {
    const result = await this.listingModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Listing not found');
  }
}
