import React, { useEffect, useState } from 'react'
import FavWatchlistItems from './components/FavWatchlistItems';
import { useParams, useLocation, useSearchParams, Link } from 'react-router-dom'
import { useFirestore } from './App'; // Import the hook from App.js
function FavWatchList({ useMoviza, forWhat }) {
    const { fav, watchList, handleFav, handleWatchList } = useFirestore(); // Access context values
    const [search, setSearch] = useSearchParams();
    const [filter, setFilter] = useState([
        { filter: "All", type: "all", active: true },
        { filter: "Movie", type: "type", active: false },
        { filter: "Series", type: "type", active: false },
        { filter: "Anime", type: "cinematography", active: false },
        { filter: "Animation", type: "cinematography", active: false },
        { filter: "Live-Action", type: "cinematography", active: false }])
    const { loading, error, moviza, Imdb } = useMoviza();
    const [movizaNew, setMovizaNew] = useState([])
    const [gridImdb, setGridImdb] = useState([])
    useEffect(() => {
        setFilter([
            { filter: "All", type: "all", active: true },
            { filter: "Movie", type: "type", active: false },
            { filter: "Series", type: "type", active: false },
            { filter: "Anime", type: "cinematography", active: false },
            { filter: "Animation", type: "cinematography", active: false },
            { filter: "Live-Action", type: "cinematography", active: false }])
    }, [forWhat])
    useEffect(() => {
        setMovizaNew(moviza);
        setGridImdb(Imdb);
        if (search.get('filter')) {
            const newFil = filter.map(f => {
                return f.filter === search.get('filter')
                    ? { ...f, active: true }
                    : { ...f, active: false };
            });
            setFilter(newFil);
            if (search.get('filter') != "All" && search.get('filter') != "") {
                if (forWhat == 'fav') setMovizaNew(moviza.filter(m => m[search.get('type')] == search.get('filter') && fav.includes(m.imdb_id)))
                else setMovizaNew(moviza.filter(m => m[search.get('type')] == search.get('filter') && watchList.includes(m.imdb_id)))
            } else {
                if (forWhat == 'fav') setMovizaNew(moviza.filter(m => fav.includes(m.imdb_id)))
                else setMovizaNew(moviza.filter(m => watchList.includes(m.imdb_id)))
            }
        } else {
            if (forWhat == 'fav') setMovizaNew(moviza.filter(m => fav.includes(m.imdb_id)))
            else setMovizaNew(moviza.filter(m => watchList.includes(m.imdb_id)))
        }

    }, [loading, search, fav, watchList, forWhat]); // Added `search` to dependencies
    return (
        <>
            <section className='mt-5 pt-5 container'>
                <div className="row">
                    <div className="col-12 py-5">
                        <h6 className='d-flex flex-wrap gap-3 genre'>
                            {filter.map((f, i) => (<span key={i} role='button' onClick={() => { setSearch({ filter: f.filter, type: f.type }) }} className={(f.active) ? "active" : ""}>{f.filter}</span>))}
                        </h6>
                    </div>
                </div>
            </section >
            <FavWatchlistItems loading={loading} error={error} moviza={movizaNew} Imdb={gridImdb} range={99} ></FavWatchlistItems>
        </>
    )
}

export default FavWatchList
