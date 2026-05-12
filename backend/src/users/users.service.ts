import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; // Types supprime
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // ─── REGISTER ───────────────────────────────────────────
  async register(dto: CreateUserDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already used');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Exclude password from spread
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...rest } = dto;
    const user = await this.userModel.create({ ...rest, passwordHash });

    return this.signToken(user);
  }

  // ─── LOGIN ──────────────────────────────────────────────
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    return this.signToken(user);
  }

  // ─── GET PROFILE ────────────────────────────────────────
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ─── UPDATE PROFILE ─────────────────────────────────────
  async updateProfile(userId: string, dto: Partial<CreateUserDto>) {
    const updateData: Record<string, unknown> = { ...dto };

    // Hash new password if provided
    if (dto.password) {
      updateData['passwordHash'] = await bcrypt.hash(dto.password, 10);
      delete updateData['password'];
    }

    const user = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select('-passwordHash');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ─── DELETE ACCOUNT ─────────────────────────────────────
  async deleteAccount(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new NotFoundException('User not found');
    return { message: 'Account deleted successfully' };
  }

  // ─── GET WISHLIST ────────────────────────────────────────
  async getWishlist(userId: string) {
    const user = await this.userModel.findById(userId).populate('wishlistIds');

    if (!user) throw new NotFoundException('User not found');
    return user.wishlistIds;
  }

  // ─── ADD TO WISHLIST ─────────────────────────────────────
  async addToWishlist(userId: string, listingId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const alreadyAdded = user.wishlistIds.some(
      (id) => id.toString() === listingId,
    );
    if (alreadyAdded)
      throw new BadRequestException('Listing already in wishlist');

    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { wishlistIds: listingId } },
        { new: true },
      )
      .select('-passwordHash');
  }

  // ─── REMOVE FROM WISHLIST ────────────────────────────────
  async removeFromWishlist(userId: string, listingId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { wishlistIds: listingId } },
        { new: true },
      )
      .select('-passwordHash');
  }

  // ─── HELPER : generate JWT ───────────────────────────────
  private signToken(user: UserDocument) {
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    };
  }
}
