import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useFirestore } from './App'; // Import the hook from App.js
import { useMoviza } from './customHook/useMoviza'; // Import the custom hook
import GridItem from './components/GridItem';

function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchText } = location.state || "";

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const { loading, error, moviza, Imdb } = useMoviza();

    useEffect(() => {
        if (location.state != null) {
            setSearch(searchText);
            const result = moviza.filter(m => m.title.toLowerCase().includes(searchText.toLowerCase()) || m.detail.toLowerCase().includes(searchText.toLowerCase()));
            setSearchResult(result);
        }
    }, [location, moviza, Imdb]);



    const { fav, watchList, handleFav, handleWatchList } = useFirestore(); // Access context values
    const [myFav, setMyFav] = useState(null);
    const [myWatchList, setMyWatchList] = useState(null);
    useEffect(() => {
        setMyFav(fav)
        setMyWatchList(watchList)
    }, [fav, watchList]);


    const getDataById = (id) => {
        const movizaData = moviza.filter(m => m.imdb_id == id);
        const ImdbData = Imdb.filter(m => m.imdbID == id);
        return { moviza: movizaData, imdb: ImdbData }
    }

    const handleSearch = (e) => {
        setSearchResult([]);
        setSearch(e.target.value);
        if (e.target.value.trim() != "") {
            const result = moviza.filter(m => m.title.toLowerCase().includes(e.target.value.toLowerCase()) || m.detail.toLowerCase().includes(e.target.value.toLowerCase()));
            setSearchResult(result);
        }
    }

    return (
        <section className='container mt-5 search-page'>
            <div className="row py-5">
                <div className="col-12 col-xl-6 py-5 px-4">
                    <input value={search} onChange={(e) => handleSearch(e)} placeholder='Search Movies , Series , Anime.....' className='search fs-5 full-radius py-2 px-3 w-100' type="text" />
                </div>
            </div>
            <div className="row">
                <div className="col-12 gridItems">
                    {(searchResult.length > 0) ? searchResult.map((result, index) => {
                        const imdbDatas = getDataById(result.imdb_id);
                        console.log(imdbDatas)
                        return <GridItem key={index} item={result} Imdb={Imdb} ></GridItem>
                    }) : <h1 className='no-data'>No Data Found</h1>}
                </div>
            </div>
        </section>
    )
}

export default Search
