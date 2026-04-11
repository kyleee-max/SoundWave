# 🎵 SoundWave

Website musik streaming berbasis Next.js 14 dengan YouTube Data API v3.  
Desain hitam elegan ala Vercel dashboard + layout mobile-first.

---

## ✨ Fitur

- 🔍 **Search** — cari lagu & artist via YouTube API
- ▶️ **Player** — putar full audio via YouTube IFrame (hidden video)
- 🎯 **Filter Genre** — Pop, Hip-Hop, R&B, Electronic, Rock, Jazz, K-Pop, dll
- 😌 **Filter Mood** — Chill, Workout, Late Night, Party, Focus, dll
- ❤️ **Favorites** — simpan lagu favorit (localStorage, no login needed)
- 📋 **Playlist** — buat & kelola playlist sendiri
- 🎤 **Lyrics** — tampilkan lirik via lyrics.ovh (gratis)
- 📊 **Charts** — top charts global & regional
- 📱 **Mobile-first** — bottom nav, sidebar drawer on mobile
- 🖥️ **Desktop** — sidebar permanent, full layout

---

## 🚀 Cara Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd soundwave
npm install
```

### 2. Dapetin YouTube API Key (GRATIS)

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Buat project baru (atau pilih yang sudah ada)
3. Klik **"Enable APIs and Services"**
4. Cari **"YouTube Data API v3"** → Enable
5. Pergi ke **Credentials** → **Create Credentials** → **API Key**
6. Copy API key-nya

> ✅ Gratis 10.000 request/hari — cukup untuk development & small scale

### 3. Setup environment variable

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
YT_V3_KEY=paste_api_key_kamu_di_sini
```

### 4. Run development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🚢 Deploy ke Vercel

1. Push ke GitHub
2. Import di [vercel.com](https://vercel.com)
3. Di **Environment Variables**, tambahkan:
   - Key: `YT_V3_KEY`
   - Value: API key YouTube kamu
4. Deploy!

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── page.tsx                  ← Home (trending + filter)
│   ├── search/page.tsx           ← Search
│   ├── favorites/page.tsx        ← Liked songs
│   ├── library/page.tsx          ← Playlists
│   ├── charts/page.tsx           ← Top charts
│   ├── playlist/[id]/page.tsx    ← Playlist detail
│   └── api/
│       ├── youtube/search/       ← GET ?q=query
│       ├── youtube/trending/     ← GET ?genre=&mood=
│       └── lyrics/               ← GET ?artist=&title=
│
├── components/
│   ├── Player/          ← Sticky player, YouTube IFrame
│   ├── Sidebar/         ← Desktop sidebar + mobile drawer
│   ├── BottomNav/       ← Mobile bottom navigation
│   ├── Topbar/          ← Mobile topbar + hamburger
│   ├── SongCard/        ← Card dengan hover play
│   ├── TrackTable/      ← List view dengan row
│   ├── FilterChips/     ← Scrollable filter chips
│   └── LyricsModal/     ← Bottom sheet lyrics
│
├── store/
│   └── playerStore.ts   ← Zustand (track, queue, favorites, playlists)
│
├── lib/
│   └── youtube.ts       ← YouTube API wrapper
│
└── types/
    └── index.ts         ← TypeScript types
```

---

## 🔧 Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand + localStorage |
| Data Fetching | TanStack Query |
| Music Source | YouTube Data API v3 |
| Player | YouTube IFrame API |
| Lyrics | lyrics.ovh (free) |
| Icons | Lucide React |
| Deploy | Vercel |

---

## 📝 Notes

- **Audio player** menggunakan YouTube IFrame API dengan video tersembunyi — legal & gratis
- **Data** disimpan di localStorage (favorites, playlists, volume) — no backend needed
- **Lyrics** dari lyrics.ovh — gratis, no API key, tapi coverage tidak 100%
- **API quota** YouTube: 10.000 units/hari. Search = 100 units, trending = 1 unit
