import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing, ListingDocument } from './schemas/listing.schema';
import { CreateListingDto } from './dto/create-listing.dto';

export interface ListingFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
}

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────
  async create(dto: CreateListingDto, hostId: string) {
    // Convertit les strings en Date pour availability
    const availability = dto.availability?.map((window) => ({
      from: new Date(window.from),
      to: new Date(window.to),
    }));

    return this.listingModel.create({ ...dto, hostId, availability });
  }

  // ─── FIND ALL ────────────────────────────────────────────
  async findAll(filters: ListingFilters) {
    const query: Record<string, unknown> = { isAvailable: true };

    if (filters.city) query['location.city'] = new RegExp(filters.city, 'i');

    if (filters.type) query['type'] = filters.type;

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query['pricePerNight'] = {
        ...(filters.minPrice !== undefined && { $gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { $lte: filters.maxPrice }),
      };
    }

    if (filters.guests) query['maxGuests'] = { $gte: filters.guests };

    return this.listingModel
      .find(query)
      .populate('hostId', 'firstname lastname email avatar');
  }

  // ─── FIND ONE ────────────────────────────────────────────
  async findOne(id: string) {
    const listing = await this.listingModel
      .findById(id)
      .populate('hostId', 'firstname lastname email avatar');

    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  // ─── UPDATE ──────────────────────────────────────────────
  async update(id: string, dto: Partial<CreateListingDto>, userId: string) {
    const listing = await this.listingModel.findById(id);
    if (!listing) throw new NotFoundException('Listing not found');

    if (listing.hostId.toString() !== userId)
      throw new ForbiddenException('Access denied');

    const availability = dto.availability?.map((window) => ({
      from: new Date(window.from),
      to: new Date(window.to),
    }));

    return this.listingModel.findByIdAndUpdate(
      id,
      { ...dto, ...(availability && { availability }) },
      { new: true },
    );
  }

  // ─── REMOVE ──────────────────────────────────────────────
  async remove(id: string, userId: string) {
    const listing = await this.listingModel.findById(id);
    if (!listing) throw new NotFoundException('Listing not found');

    if (listing.hostId.toString() !== userId)
      throw new ForbiddenException('Access denied');

    await this.listingModel.findByIdAndDelete(id);
  }
}
