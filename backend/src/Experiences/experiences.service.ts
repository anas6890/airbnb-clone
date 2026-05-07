import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experience, ExperienceDocument } from './schemas/experience.schema';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectModel(Experience.name)
    private experienceModel: Model<ExperienceDocument>,
  ) {}

  async create(dto: CreateExperienceDto): Promise<ExperienceDocument> {
    const experience = new this.experienceModel(dto);
    return experience.save();
  }

  async findAll(city?: string): Promise<ExperienceDocument[]> {
    const filter = city
      ? { 'location.city': new RegExp(city, 'i'), isActive: true }
      : { isActive: true };
    return this.experienceModel.find(filter).populate('hostId', 'name avatar');
  }

  async findOne(id: string): Promise<ExperienceDocument> {
    const experience = await this.experienceModel
      .findById(id)
      .populate('hostId', 'name avatar');
    if (!experience) throw new NotFoundException('Experience not found');
    return experience;
  }

  async update(
    id: string,
    dto: Partial<CreateExperienceDto>,
  ): Promise<ExperienceDocument> {
    const experience = await this.experienceModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!experience) throw new NotFoundException('Experience not found');
    return experience;
  }

  async remove(id: string): Promise<void> {
    const result = await this.experienceModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Experience not found');
  }
}
