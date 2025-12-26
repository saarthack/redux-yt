import React from 'react'
import ResultCard from './ResultCard'


export default function ResultsGrid({ items }) {
    if (!items || items.length === 0) return <div className="p-6 text-center text-gray-500">No results</div>
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            {items.map((it) => (
                <ResultCard key={it.id} item={it} />
            ))}
        </div>
    )
}