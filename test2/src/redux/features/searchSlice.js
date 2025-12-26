import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchPhotos, fetchGifs, fetchVideos } from '../../api/mediaApi'


export const searchPhotos = createAsyncThunk('search/photos', async ({ query }) => {
    return await fetchPhotos(query)
})
export const searchGifs = createAsyncThunk('search/gifs', async ({ query }) => {
    return await fetchGifs(query)
})
export const searchVideos = createAsyncThunk('search/videos', async ({ query }) => {
    return await fetchVideos(query)
})


const initialState = {
    query: '',
    photos: { items: [], status: 'idle', error: null },
    gifs: { items: [], status: 'idle', error: null },
    videos: { items: [], status: 'idle', error: null },
}


const slice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery(state, action) {
            state.query = action.payload
        },
        clearResults(state) {
            state.photos.items = []
            state.gifs.items = []
            state.videos.items = []
            state.query = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchPhotos.pending, (s) => { s.photos.status = 'loading'; s.photos.error = null })
            .addCase(searchPhotos.fulfilled, (s, a) => { s.photos.status = 'succeeded'; s.photos.items = a.payload })
            .addCase(searchPhotos.rejected, (s, a) => { s.photos.status = 'failed'; s.photos.error = a.error.message })


            .addCase(searchGifs.pending, (s) => { s.gifs.status = 'loading'; s.gifs.error = null })
            .addCase(searchGifs.fulfilled, (s, a) => { s.gifs.status = 'succeeded'; s.gifs.items = a.payload })
            .addCase(searchGifs.rejected, (s, a) => { s.gifs.status = 'failed'; s.gifs.error = a.error.message })


            .addCase(searchVideos.pending, (s) => { s.videos.status = 'loading'; s.videos.error = null })
            .addCase(searchVideos.fulfilled, (s, a) => { s.videos.status = 'succeeded'; s.videos.items = a.payload })
            .addCase(searchVideos.rejected, (s, a) => { s.videos.status = 'failed'; s.videos.error = a.error.message })
    },
})


export const { setQuery, clearResults } = slice.actions
export default slice.reducer