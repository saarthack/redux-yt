import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setQuery, searchPhotos, searchGifs, searchVideos } from '../redux/features/searchSlice'


export default function SearchBar() {
    const [text, setText] = useState('')
    const dispatch = useDispatch()


    const doSearch = (q) => {
        const qTrim = q?.trim()
        if (!qTrim) return
        dispatch(setQuery(qTrim))
        dispatch(searchPhotos({ query: qTrim }))
        dispatch(searchGifs({ query: qTrim }))
        dispatch(searchVideos({ query: qTrim }))
    }


    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && doSearch(text)}
                    placeholder="Search photos, GIFs, videos — try 'cyberpunk'"
                    className="flex-1 p-3 rounded shadow focus:outline-none"
                />
                <button onClick={() => doSearch(text)} className="px-4 py-2 bg-indigo-600 text-white rounded">Search</button>
            </div>
        </div>
    )
}

