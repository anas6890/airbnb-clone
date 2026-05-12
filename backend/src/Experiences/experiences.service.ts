import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experience, ExperienceDocument } from './schemas/experience.schema';
import { CreateExperienceDto } from './dto/create-experience.dto';

export interface ExperienceFilters {
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectModel(Experience.name)
    private experienceModel: Model<ExperienceDocument>,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────
  async create(dto: CreateExperienceDto, hostId: string) {
    const schedule = dto.schedule?.map((slot) => ({
      ...slot,
      date: new Date(slot.date),
    }));

    return this.experienceModel.create({ ...dto, hostId, schedule });
  }

  // ─── FIND ALL ────────────────────────────────────────────
  async findAll(filters: ExperienceFilters) {
    const query: Record<string, unknown> = { isActive: true };

    if (filters.city) query['location.city'] = new RegExp(filters.city, 'i');

    if (filters.category) query['category'] = filters.category;

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query['pricePerPerson'] = {
        ...(filters.minPrice !== undefined && { $gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { $lte: filters.maxPrice }),
      };
    }

    return this.experienceModel
      .find(query)
      .populate('hostId', 'firstname lastname avatar');
  }

  // ─── FIND ONE ────────────────────────────────────────────
  async findOne(id: string) {
    const experience = await this.experienceModel
      .findById(id)
      .populate('hostId', 'firstname lastname avatar');

    if (!experience) throw new NotFoundException('Experience not found');
    return experience;
  }

  // ─── UPDATE ──────────────────────────────────────────────
  async update(id: string, dto: Partial<CreateExperienceDto>, userId: string) {
    const experience = await this.experienceModel.findById(id);
    if (!experience) throw new NotFoundException('Experience not found');

    if (experience.hostId.toString() !== userId)
      throw new ForbiddenException('Access denied');

    const schedule = dto.schedule?.map((slot) => ({
      ...slot,
      date: new Date(slot.date),
    }));

    return this.experienceModel.findByIdAndUpdate(
      id,
      { ...dto, ...(schedule && { schedule }) },
      { new: true },
    );
  }

  // ─── REMOVE ──────────────────────────────────────────────
  async remove(id: string, userId: string) {
    const experience = await this.experienceModel.findById(id);
    if (!experience) throw new NotFoundException('Experience not found');

    if (experience.hostId.toString() !== userId)
      throw new ForbiddenException('Access denied');

    await this.experienceModel.findByIdAndDelete(id);
  }
}
