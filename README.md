# 🌭 Perros Index

Track hot dog prices across Venezuela in real-time! Users report prices from their local vendors and the app calculates regional and national averages.

## ✨ Features

- 📍 **Interactive Map**: View hot dog prices across Venezuela with Leaflet
- 💰 **Dual Currency Display**: Prices in both BCV and USDT rates
- 📊 **Real-time Averages**: National and local price averages updated live
- 📝 **Community Reports**: Users submit prices with location data
- 🔄 **Live Updates**: TanStack Query polling + Supabase real-time subscriptions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Maps**: React Leaflet
- **Backend**: Supabase (PostgreSQL + PostGIS)
- **Animations**: Framer Motion

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/              # shadcn/ui primitives
│   ├── HotDogMap.tsx    # Main map component
│   ├── PerroTicker.tsx  # Price ticker with averages
│   ├── SubmitModal.tsx  # Report submission form
│   ├── BottomSheet.tsx  # Mobile-friendly bottom drawer
│   ├── DisclaimerModal.tsx  # App info modal
│   └── DataProvider.tsx # Data synchronization wrapper
├── hooks/               # Custom React hooks
│   ├── useExchangeRates.ts  # Fetch exchange rates with polling
│   ├── useReports.ts        # Fetch reports with polling
│   └── use-toast.ts         # Toast notifications
├── services/            # API service layers
│   ├── reportService.ts      # CRUD operations for reports
│   └── exchangeRateService.ts # Exchange rate fetching
├── store/               # Zustand stores
│   └── useAppStore.ts   # Global app state
├── mocks/               # Mock data for development
├── lib/                 # Utilities and configurations
│   ├── supabase.ts      # Supabase client
│   ├── database.types.ts # Generated DB types
│   └── utils.ts         # Helper functions
└── pages/               # Route pages
    ├── Index.tsx        # Main page
    └── NotFound.tsx     # 404 page
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- pnpm (`npm install -g pnpm`)
- Supabase account (optional, uses mock data without it)

### Installation

```bash
# Clone the repository
git clone https://github.com/jodaz/hot-dog-tracker.git
cd hot-dog-tracker

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note**: The app works without Supabase using mock data for development.

## 🐳 Docker

Build and run with Docker:

```bash
# Build with environment variables
export $(grep -v '^#' .env.local | xargs) && docker build \
  --build-arg VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
  --build-arg VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
  -t hot-dog-tracker .

# Run the container
docker run -p 4173:4173 hot-dog-tracker
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |

## 🗄️ Database Setup (Supabase)

1. Create a new Supabase project
2. Run migrations from `supabase/migrations/`
3. Enable PostGIS extension for geospatial queries
4. Set up storage bucket `report-photos` for image uploads

## 👤 Author

**Jesus Ordosgoitty**  
🌐 [jodaz.xyz](https://jodaz.xyz)

## 📄 License

MIT
