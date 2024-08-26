import React, { useEffect, useState } from 'react'
import GridItems from './components/GridItems';
import { useParams, useLocation, useSearchParams, Link } from 'react-router-dom'
function Lists({ useMoviza, types, check, queryCheck }) {

    const [search, setSearch] = useSearchParams();

    const [cat, setCat] = useState([{ cat: "All", active: true }, { cat: "Anime", active: false }, { cat: "Animation", active: false }, { cat: "Live-Action", active: false }])
    const [typeQ, setTypeQ] = useState([{ type: "All", active: true }, { type: "Movie", active: false }, { type: "Series", active: false }])

    const { loading, error, moviza, Imdb } = useMoviza();

    const [movizaNew, setMovizaNew] = useState([])
    const [gridImdb, setGridImdb] = useState([])

    useEffect(() => {
        setMovizaNew(moviza);
        setGridImdb(Imdb);
        if (search.get(queryCheck[1])) {
            if (queryCheck[1] == "cat") {
                const newCat = cat.map(c => {
                    return c.cat === search.get(queryCheck[1])
                        ? { ...c, active: true }
                        : { ...c, active: false };
                });
                setCat(newCat);
            } else {
                const newTypeQ = typeQ.map(t => {
                    return t.type === search.get(queryCheck[1])
                        ? { ...t, active: true }
                        : { ...t, active: false };
                });
                setTypeQ(newTypeQ);
            }
            if (search.get(queryCheck[1]) != "All" && search.get(queryCheck[1]) != "") {
                setMovizaNew(moviza.filter(item => item[queryCheck[0]] === search.get(queryCheck[1]) && item[check] === types))
            }
        }

    }, [loading, search]); // Added `search` to dependencies




    return (
        <>
            <section className='mt-5 pt-5 container'>
                <div className="row">
                    <div className="col-12 py-5">
                        <h6 className='d-flex flex-wrap gap-3 genre'>
                            {(queryCheck[1] == 'cat') ? cat.map((c, i) => (<span key={i} role='button' onClick={() => { setSearch({ cat: c.cat }) }} className={(c.active) ? "active" : ""}>{c.cat}</span>)) : typeQ.map((t, i) => (<span key={i} role='button' onClick={() => { setSearch({ type: t.type }) }} className={(t.active) ? "active" : ""}>{t.type}</span>))}
                        </h6>
                    </div>
                </div>
            </section >
            <GridItems loading={loading} error={error} moviza={movizaNew} Imdb={gridImdb} match={types} type={check} range={99} ></GridItems>
        </>
    )
}

export default Lists
