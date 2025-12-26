
import { useSelector } from 'react-redux'
import ResultGrid from '../components/ResultGrid'
import SearchBar from '../components/SearchBar'
import Tabs from '../components/Tabs'
const HomePage = () => {

    const { query } = useSelector((store) => store.search)




    return (
        <div>

            <SearchBar />

            {query != '' ? <div><Tabs /><ResultGrid /></div> : ''}
        </div>
    )
}

export default HomePage