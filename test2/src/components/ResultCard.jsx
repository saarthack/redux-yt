import { useDispatch, useSelector } from 'react-redux'
import { addItem, removeItem } from '../redux/features/collectionSlice'


export default function ResultCard({ item }) {
    const dispatch = useDispatch()
    const saved = useSelector(s => s.collection.items.some(it => it.id === item.id))


    console.log(item);
    
    return (
        <div className="bg-white rounded shadow p-2 flex flex-col">
            <div className="h-40 w-full mb-2 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {item.thumbnail ? (
                    item.type == 'photo' ? <img src={item.thumbnail} alt={item.title} className="object-cover h-full w-full" /> : <video className='object-cover h-full w-full' src={item.src} autoPlay loop muted></video>
                ) : (
                    <div className="text-sm text-gray-400">No preview</div>
                )}
            </div>
            <div className="flex-1">
                <div className="font-medium text-sm truncate">{item.title}</div>
                <div className="text-xs text-gray-500">{item.type.toUpperCase()}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
                <a href={item.src} target="_blank" rel="noreferrer" className="text-xs underline">Open</a>
                <button
                    onClick={() => saved ? dispatch(removeItem(item.id)) : dispatch(addItem(item))}
                    className={`px-3 py-1 rounded text-sm ${saved ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {saved ? 'Remove' : 'Save'}
                </button>
            </div>
        </div>
    )
}