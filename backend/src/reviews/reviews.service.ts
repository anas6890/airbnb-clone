import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Listing, ListingDocument } from '../listings/schemas/listing.schema';
import {
  Experience,
  ExperienceDocument,
} from '../experiences/schemas/experience.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
    @InjectModel(Experience.name)
    private experienceModel: Model<ExperienceDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────
  async create(dto: CreateReviewDto, authorId: string) {
    // 1. Verifie que le booking appartient au user
    const booking = await this.bookingModel.findById(dto.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.guestId.toString() !== authorId)
      throw new ForbiddenException('This booking does not belong to you');

    // 2. Verifie qu'il n'a pas deja laisse un avis pour ce booking
    const existing = await this.reviewModel.findOne({
      bookingId: dto.bookingId,
      authorId,
    });
    if (existing)
      throw new BadRequestException('You already reviewed this booking');

    // 3. Recupere le user pour le snapshot
    const author = await this.userModel.findById(authorId).lean<UserDocument>();
    if (!author) throw new NotFoundException('User not found');

    // 4. Cree le review
    const review = await this.reviewModel.create({
      ...dto,
      authorId,
      authorSnapshot: {
        name: `${author.firstname} ${author.lastname}`,
        avatar: author.avatar,
      },
    });

    // 5. Met a jour avgRating et reviewCount sur le listing ou l'experience
    await this.updateTargetRating(dto.targetId, dto.targetModel);

    return review;
  }

  // ─── FIND BY LISTING ─────────────────────────────────────
  async findByListing(listingId: string) {
    return this.reviewModel
      .find({ targetId: listingId, targetModel: 'Listing' })
      .populate('authorId', 'firstname lastname avatar');
  }

  // ─── FIND BY EXPERIENCE ──────────────────────────────────
  async findByExperience(experienceId: string) {
    return this.reviewModel
      .find({ targetId: experienceId, targetModel: 'Experience' })
      .populate('authorId', 'firstname lastname avatar');
  }

  // ─── FIND ONE ────────────────────────────────────────────
  async findOne(id: string) {
    const review = await this.reviewModel
      .findById(id)
      .populate('authorId', 'firstname lastname avatar');

    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  // ─── REMOVE ──────────────────────────────────────────────
  async remove(id: string, userId: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException('Review not found');

    if (review.authorId.toString() !== userId)
      throw new ForbiddenException('Access denied');

    await this.reviewModel.findByIdAndDelete(id);

    // Recalcule la note apres suppression
    await this.updateTargetRating(
      review.targetId.toString(),
      review.targetModel,
    );
  }

  // ─── HELPER : recalcule avgRating ────────────────────────
  private async updateTargetRating(targetId: string, targetModel: string) {
    const reviews = await this.reviewModel.find({ targetId, targetModel });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const reviewCount = reviews.length;
    const rounded = Math.round(avgRating * 10) / 10; // ex: 4.3

    if (targetModel === 'Listing') {
      await this.listingModel.findByIdAndUpdate(targetId, {
        avgRating: rounded,
        reviewCount,
      });
    } else if (targetModel === 'Experience') {
      await this.experienceModel.findByIdAndUpdate(targetId, {
        avgRating: rounded,
        reviewCount,
      });
    }
  }
}
