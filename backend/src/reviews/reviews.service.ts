import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(dto: CreateReviewDto): Promise<ReviewDocument> {
    const review = new this.reviewModel(dto);
    return review.save();
  }

  async findByListing(listingId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ listing: listingId })
      .populate('author', 'name avatar');
  }

  async findOne(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findById(id)
      .populate('author', 'name avatar');
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Review not found');
  }
}
