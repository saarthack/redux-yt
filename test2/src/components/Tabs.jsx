import { useState } from 'react'
import { useSelector } from 'react-redux'
import ResultsGrid from './ResultsGrid'


export default function Tabs() {
    const [tab, setTab] = useState('photos')
    const { photos, gifs, videos, query } = useSelector(s => s.search)


    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex gap-2 p-4">
                <button onClick={() => setTab('photos')} className={`px-3 py-1 rounded ${tab === 'photos' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Photos</button>
                <button onClick={() => setTab('gifs')} className={`px-3 py-1 rounded ${tab === 'gifs' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>GIFs</button>
                <button onClick={() => setTab('videos')} className={`px-3 py-1 rounded ${tab === 'videos' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Videos</button>
                <div className="ml-auto text-sm text-gray-600">{query ? `Results for "${query}"` : 'Search something'}</div>
            </div>


            <div>
                {tab === 'photos' && (
                    <div>
                        {photos.status === 'loading' ? <div className="p-4">Loading photos...</div> : null}
                        {photos.error ? <div className="p-4 text-red-500">{photos.error}</div> : null}
                        <ResultsGrid items={photos.items} />
                    </div>
                )}


                {tab === 'gifs' && (
                    <div>
                        {gifs.status === 'loading' ? <div className="p-4">Loading GIFs...</div> : null}
                        {gifs.error ? <div className="p-4 text-red-500">{gifs.error}</div> : null}
                        <ResultsGrid items={gifs.items} />
                    </div>
                )}


                {tab === 'videos' && (
                    <div>
                        {videos.status === 'loading' ? <div className="p-4">Loading videos...</div> : null}
                        {videos.error ? <div className="p-4 text-red-500">{videos.error}</div> : null}
                        <ResultsGrid items={videos.items} />
                    </div>
                )}
            </div>
        </div>
    )
}

