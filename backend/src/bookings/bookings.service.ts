import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { differenceInDays } from 'date-fns';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Listing, ListingDocument } from '../listings/schemas/listing.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────
  async create(dto: CreateBookingDto, guestId: string) {
    // 1. Récupère le listing
    const listing = await this.listingModel.findById(dto.listingId);
    if (!listing) throw new NotFoundException('Listing introuvable');
    if (!listing.isAvailable)
      throw new BadRequestException("Ce listing n'est pas disponible");

    // 2. Récupère le guest
    const guest = await this.userModel.findById(guestId);
    if (!guest) throw new NotFoundException('Utilisateur introuvable');

    // 3. Calcule le prix
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    const nights = differenceInDays(checkOut, checkIn);
    if (nights < 1)
      throw new BadRequestException(
        "La date de départ doit être après la date d'arrivée",
      );

    const subtotal = listing.pricePerNight * nights;
    const cleaningFee = listing.cleaningFee ?? 0;
    const serviceFee = Math.round(subtotal * 0.12); // 12% de frais de service
    const total = subtotal + cleaningFee + serviceFee;

    // 4. Crée la réservation
    return this.bookingModel.create({
      checkIn,
      checkOut,
      guestId,
      listingId: dto.listingId,
      guestsBreakdown: dto.guestsBreakdown,
      status: 'pending',
      priceSnapshot: {
        pricePerNight: listing.pricePerNight,
        nights,
        subtotal,
        cleaningFee,
        serviceFee,
        total,
      },
      guestSnapshot: {
        name: `${guest.firstname} ${guest.lastname}`,
        avatar: guest.avatar,
      },
    });
  }

  // ─── FIND ALL (admin) ────────────────────────────────────
  async findAll() {
    return this.bookingModel
      .find()
      .populate('listingId', 'title location')
      .populate('guestId', 'firstname lastname email');
  }

  // ─── FIND MY BOOKINGS ────────────────────────────────────
  async findMyBookings(guestId: string) {
    return this.bookingModel
      .find({ guestId })
      .populate('listingId', 'title location images');
  }

  // ─── FIND ONE ────────────────────────────────────────────
  async findOne(id: string, userId: string) {
    const booking = await this.bookingModel
      .findById(id)
      .populate('listingId')
      .populate('guestId', 'firstname lastname email');

    if (!booking) throw new NotFoundException('Réservation introuvable');

    // Un user ne peut voir que ses propres réservations
    if (booking.guestId.toString() !== userId)
      throw new ForbiddenException('Accès interdit');

    return booking;
  }

  // ─── UPDATE STATUS ───────────────────────────────────────
  async updateStatus(id: string, status: string, userId: string) {
    if (!VALID_STATUSES.includes(status))
      throw new BadRequestException(
        `Statut invalide. Valeurs acceptées : ${VALID_STATUSES.join(', ')}`,
      );

    const booking = await this.bookingModel.findById(id);
    if (!booking) throw new NotFoundException('Réservation introuvable');

    // Seul le guest peut annuler sa réservation
    if (booking.guestId.toString() !== userId)
      throw new ForbiddenException('Accès interdit');

    return this.bookingModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}
