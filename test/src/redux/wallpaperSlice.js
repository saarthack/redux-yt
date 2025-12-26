// wallpaperSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const UNSPLASH_ACCESS_KEY = 'klnXbPRjpK6ojuOPrj89rKU9s2tI-4nyPwAhgdaeuMY';
const TENOR_API_KEY = 'AIzaSyA3teFiPFCVpFEItFuzzzzKrvnBg5hw9FQ';

// Async thunks to fetch images and gifs
export const fetchUnsplash = createAsyncThunk(
  'wallpaper/fetchUnsplash',
  async (query, thunkAPI) => {
    const q = encodeURIComponent(query || 'abstract');
    const res = await fetch(
      `https://api.unsplash.com/search/photos?page=1&per_page=8&query=${q}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    if (!res.ok) throw new Error('Unsplash fetch failed');
    const data = await res.json();
    // return urls array (regular / small)
    return data.results.map((r) => ({
      id: r.id,
      url: r.urls.regular,
      thumb: r.urls.small,
      alt: r.alt_description || r.description || '',
    }));
  }
);

export const fetchTenor = createAsyncThunk(
  'wallpaper/fetchTenor',
  async (query, thunkAPI) => {
    const q = encodeURIComponent(query || 'sparkle');
    // Tenor v2 example
    const res = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${q}&key=${TENOR_API_KEY}&limit=8`
    );
    if (!res.ok) throw new Error('Tenor fetch failed');
    const data = await res.json();
    // tenor v2 returns results with media_formats
    return data.results.map((r) => {
      const media = r.media_formats?.gif || r.media_formats?.mediumgif || null;
      const url =
        (media && media.url) ||
        (r.media && r.media[0] && r.media[0].gif && r.media[0].gif.url) ||
        '';
      return { id: r.id, url };
    }).filter(Boolean);
  }
);

// helper: load favorites from localStorage
const loadFavorites = () => {
  try {
    const raw = localStorage.getItem('wall-favs');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const initialState = {
  images: [],
  gifs: [],
  loadingImages: false,
  loadingGifs: false,
  error: null,
  selectedImage: null,
  selectedGif: null,
  palette: ['#0f172a', '#ff0066', '#00d4ff'],
  favorites: loadFavorites(),
  settings: {
    speed: 1,
    blur: 8,
    overlayOpacity: 0.6,
  },
};

const wallpaperSlice = createSlice({
  name: 'wallpaper',
  initialState,
  reducers: {
    setSelectedImage(state, action) {
      state.selectedImage = action.payload;
    },
    setSelectedGif(state, action) {
      state.selectedGif = action.payload;
    },
    setPalette(state, action) {
      state.palette = action.payload;
    },
    setSetting(state, action) {
      const { key, value } = action.payload;
      state.settings[key] = value;
    },
    saveFavorite(state, action) {
      state.favorites.unshift(action.payload);
      localStorage.setItem('wall-favs', JSON.stringify(state.favorites));
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter((f) => f.id !== action.payload);
      localStorage.setItem('wall-favs', JSON.stringify(state.favorites));
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnsplash.pending, (s) => {
        s.loadingImages = true;
        s.error = null;
      })
      .addCase(fetchUnsplash.fulfilled, (s, a) => {
        s.loadingImages = false;
        s.images = a.payload;
        if (a.payload.length > 0) s.selectedImage = a.payload[0];
      })
      .addCase(fetchUnsplash.rejected, (s, a) => {
        s.loadingImages = false;
        s.error = a.error.message || 'unsplash error';
      })
      .addCase(fetchTenor.pending, (s) => {
        s.loadingGifs = true;
        s.error = null;
      })
      .addCase(fetchTenor.fulfilled, (s, a) => {
        s.loadingGifs = false;
        s.gifs = a.payload;
        if (a.payload.length > 0) s.selectedGif = a.payload[0];
      })
      .addCase(fetchTenor.rejected, (s, a) => {
        s.loadingGifs = false;
        s.error = a.error.message || 'tenor error';
      });
  },
});

export const {
  setSelectedImage,
  setSelectedGif,
  setPalette,
  setSetting,
  saveFavorite,
  removeFavorite,
  clearError,
} = wallpaperSlice.actions;

export default wallpaperSlice.reducer;
