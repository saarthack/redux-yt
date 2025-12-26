
import { useSelector, useDispatch } from 'react-redux'
import { clearCollection } from '../redux/features/collectionSlice'
import ResultCard from '../components/ResultCard'


export default function CollectionPage() {
    const items = useSelector(s => s.collection.items)
    const dispatch = useDispatch()


    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">My Collection ({items.length})</h2>
                <div>
                    <button onClick={() => dispatch(clearCollection())} className="px-3 py-1 bg-red-100 text-red-700 rounded">Clear</button>
                </div>
            </div>


            {items.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No saved items yet</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {items.map(it => <ResultCard key={it.id} item={it} />)}
                </div>
            )}
        </div>
    )
}