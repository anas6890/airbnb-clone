# Airbnb Clone - Full Stack Application

Un clone Airbnb construit avec **NestJS** (Backend) et **Next.js** (Frontend).

## 🚀 Démarrage

### Prérequis

- **Node.js** (v18+ recommandé)
- **npm** ou **yarn**
- **MongoDB** (configuré et accessible)

### 1️⃣ Installation des dépendances

```bash
# Installer toutes les dépendances pour backend et frontend
npm run install:all
```

Ou manuellement:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2️⃣ Configuration des variables d'environnement

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Remplissez les variables:
- `MONGO_URI` - Connection string MongoDB
- `JWT_SECRET` - Secret JWT
- `STRIPE_SECRET_KEY` - Clé secrète Stripe
- `STRIPE_WEBHOOK_SECRET` - Secret Webhook Stripe

#### Frontend (.env.local)

```bash
cd frontend
cp .env.example .env.local
```

Variables:
- `NEXT_PUBLIC_API_URL` - URL du backend (http://localhost:3001)

### 3️⃣ Lancement en développement

#### Option 1 : Lancer les deux services simultanément

```bash
npm run dev
```

#### Option 2 : Lancer séparément

**Terminal 1 - Backend:**
```bash
npm run dev:backend
# Accès sur http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
# Accès sur http://localhost:3000
```

## 📦 Build pour production

```bash
npm run build
```

Cela va builder le backend et le frontend.

## 🧪 Tests

```bash
# Tous les tests
npm test

# Tests backend uniquement
npm run test:backend

# Tests frontend uniquement
npm run test:frontend
```

## 📁 Structure du projet

```
airbnb-clone/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── Auth/        # Module authentification
│   │   ├── users/       # Module utilisateurs
│   │   ├── listings/    # Module annonces
│   │   ├── bookings/    # Module réservations
│   │   ├── reviews/     # Module avis
│   │   ├── Experiences/ # Module expériences
│   │   ├── Payments/    # Module paiements
│   │   └── stripe/      # Module Stripe
│   └── package.json
├── frontend/            # Next.js App
│   ├── src/
│   │   ├── app/        # Pages et layout
│   │   └── components/ # Composants
│   └── package.json
└── package.json         # Scripts monorepo
```

## 🔑 API Endpoints

### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription

### Utilisateurs
- `GET /users/profile` - Profil utilisateur
- `PATCH /users/:id` - Mettre à jour utilisateur

### Annonces (Listings)
- `GET /listings` - Lister les annonces
- `GET /listings/:id` - Détails d'une annonce
- `POST /listings` - Créer une annonce
- `PATCH /listings/:id` - Mettre à jour
- `DELETE /listings/:id` - Supprimer

### Réservations (Bookings)
- `POST /bookings` - Créer une réservation
- `GET /bookings` - Lister les réservations

### Paiements
- `POST /payments` - Créer un paiement
- `GET /payments/:id` - Détails d'un paiement

## 🛠️ Technologie

### Backend
- **NestJS** - Framework TypeScript pour Node.js
- **MongoDB/Mongoose** - Base de données NoSQL
- **JWT** - Authentification
- **Stripe** - Paiements
- **Class-validator** - Validation

### Frontend
- **Next.js 16** - Framework React
- **React 19** - UI Library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📝 Licence

ISC License

---

**Note**: Assurez-vous que MongoDB est en cours d'exécution avant de lancer le backend.

