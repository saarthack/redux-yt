import axios from 'axios'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
const TENOR_KEY = import.meta.env.VITE_TENOR_KEY
const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY


const normalizePhoto = (p) => ({
    id: `photo_${p.id}`,
    type: 'photo',
    title: p.alt_description || p.description || 'Photo',
    thumbnail: p.urls.small,
    src: p.urls.full,
})


export async function fetchPhotos(query, page = 1, per_page = 20) {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, page, per_page },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    })
    return res.data.results.map(normalizePhoto)
}


const normalizeGif = (g) => ({
    id: `gif_${g.id}`,
    type: 'gif',
    title: g.content_description || g.title || 'GIF',
    thumbnail: g.media[0]?.tinygif?.url || g.media[0]?.nanogif?.url || '',
    src: g.media[0]?.gif?.url || g.media[0]?.mp4?.url || '',
})


export async function fetchGifs(query, limit = 20) {
    const res = await axios.get('https://g.tenor.com/v1/search', {
        params: { q: query, key: TENOR_KEY, limit },
    })
    return (res.data.results || []).map(normalizeGif)
}


const normalizeVideo = (v) => ({
    id: `video_${v.id}`,
    type: 'video',
    title: v.user?.name || 'Video',
    thumbnail: v.image,
    src: v.video_files?.[0]?.link || '',
})


export async function fetchVideos(query, per_page = 15) {
    // Pexels videos
    const res = await axios.get('https://api.pexels.com/videos/search', {
        params: { query, per_page },
        headers: { Authorization: PEXELS_KEY },
    })
    return (res.data.videos || []).map(normalizeVideo)
}

