import { config } from 'dotenv';
import mongoose from 'mongoose';
import { UserSchema } from '../src/users/schemas/user.schema';
import { ListingSchema } from '../src/listings/schemas/listing.schema';

config();

const MONGO_URI = process.env.MONGO_URI || '';

async function main() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const UserModel = mongoose.model('User', UserSchema);
  const ListingModel = mongoose.model('Listing', ListingSchema);

  // Clear existing data
  await UserModel.deleteMany({});
  await ListingModel.deleteMany({});

  // Create users
  // Note: passwordHash is used in the schema, not password
  const users = await UserModel.insertMany([
    {
      email: 'test1@example.com',
      passwordHash: 'hashed_password_123', // Simplified for seed
      firstname: 'Alice',
      lastname: 'Dupont',
      birthdate: new Date('1990-01-01'),
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      email: 'test2@example.com',
      passwordHash: 'hashed_password_123',
      firstname: 'Bob',
      lastname: 'Martin',
      birthdate: new Date('1985-05-05'),
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  ]);

  // Create listings
  const listings = await ListingModel.insertMany([
    {
      title: 'Magnifique Riad à Marrakech',
      description: 'Découvrez le charme de la médina dans ce riad traditionnel avec tout le confort moderne.',
      type: 'house',
      pricePerNight: 120,
      cleaningFee: 30,
      serviceFee: 15,
      maxGuests: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
      location: {
        address: '123 Rue de la Médina',
        city: 'Marrakech',
        country: 'Maroc',
        lat: 31.6295,
        lng: -7.9811,
      },
      amenities: ['Wifi', 'Piscine', 'Climatisation', 'Cuisine'],
      images: ['https://images.unsplash.com/photo-1539037116277-4db20d5bc8ea?auto=format&fit=crop&q=80&w=800'],
      hostId: users[0]._id,
      avgRating: 4.8,
      reviewCount: 12,
    },
    {
      title: 'Appartement Moderne Vue Mer',
      description: 'Bel appartement spacieux avec vue imprenable sur l\'océan à Casablanca.',
      type: 'apartment',
      pricePerNight: 85,
      cleaningFee: 20,
      serviceFee: 10,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      location: {
        address: 'Avenue de la Corniche',
        city: 'Casablanca',
        country: 'Maroc',
        lat: 33.5731,
        lng: -7.5898,
      },
      amenities: ['Wifi', 'Balcon', 'Machine à laver'],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'],
      hostId: users[1]._id,
      avgRating: 4.5,
      reviewCount: 8,
    },
    {
        title: 'Villa de Luxe avec Jardin',
        description: 'Une villa exceptionnelle avec un grand jardin et une piscine privée.',
        type: 'villa',
        pricePerNight: 350,
        cleaningFee: 100,
        serviceFee: 50,
        maxGuests: 8,
        bedrooms: 4,
        beds: 6,
        bathrooms: 3,
        location: {
          address: 'Quartier Palmier',
          city: 'Casablanca',
          country: 'Maroc',
          lat: 33.5731,
          lng: -7.5898,
        },
        amenities: ['Wifi', 'Piscine', 'Jardin', 'Parking'],
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'],
        hostId: users[0]._id,
        avgRating: 5.0,
        reviewCount: 5,
      },
  ]);

  console.log('Seeded users:', users.length);
  console.log('Seeded listings:', listings.length);
  await mongoose.disconnect();
  console.log('Disconnected');
}

main().catch((err) => console.error(err));

