import React, { useEffect, useState } from 'react'
import { useFirestore } from '../App'; // Import the hook from App.js
import { Link } from 'react-router-dom'
function Slide({ item, Imdb }) {

    const { fav, watchList, handleFav, handleWatchList } = useFirestore(); // Access context values
    const [myFav, setMyFav] = useState(null);
    const [myWatchList, setMyWatchList] = useState(null);
    const [imdbData, setImdbData] = useState(null);
    const [items, setItems] = useState([]);
    useEffect(() => {
        setItems(item)
        setMyFav(fav)
        setMyWatchList(watchList)
    }, [fav, watchList, item, Imdb, imdbData])




    useEffect(() => {
        setImdbData(() => {
            return Imdb.filter(itemImdb => itemImdb.imdbID == items.imdb_id)[0];
        });
        // Initialize tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
    }, [imdbData, Imdb])

    return (
        <div style={{ "--bg": `url(${items['banner-img']})` }} className='w-100 eachSlide h-100 row align-items-end m-0 p-md-5 p-3 pb-5'>
            <div className="col-12 col-lg-8 col-xl-6 p-md-5 d-flex flex-column gap-3">
                <h4 className='theme-clr'>{items.type}</h4>
                {(imdbData != null) && <h6 className='d-flex gap-3 genre'>{imdbData.Genre.split(', ').map((genre, i) => (<span key={i} role='button'>{genre}</span>))}</h6>}
                <h1 className='display-4 fw-bold text-balance'>{items.title}</h1>
                {(imdbData != null) && <>
                    <p className='text-balance clamp'>{imdbData.Plot}</p>
                    <div className='info d-flex gap-1 align-items-center'>
                        <h5 data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={"Released " + imdbData.Released} className='m-0'>{imdbData.Year}</h5>
                        <svg className='theme-clr' xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 256 256"><g fill="currentColor"><path d="M176 128a48 48 0 1 1-48-48a48 48 0 0 1 48 48" opacity=".2" /><path d="M140 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12" /></g></svg>
                        <h5 className='m-0'>{imdbData.Rated}</h5>
                        <svg className='theme-clr' xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 256 256"><g fill="currentColor"><path d="M176 128a48 48 0 1 1-48-48a48 48 0 0 1 48 48" opacity=".2" /><path d="M140 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12" /></g></svg>
                        <h5 className='m-0'>{imdbData.Runtime}</h5>
                    </div> </>}
                {(imdbData != null) &&
                    <div style={{ "--rating": (imdbData.imdbRating / 2) }} className='rating d-flex gap-2 align-items-center'>
                        <div
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={"Total Votes " + imdbData.imdbVotes}
                        ></div>
                        {imdbData.imdbRating}/10 Rating
                    </div>}
                <div className='d-flex gap-4 align-items-center mt-4'>
                    <Link to='../play' state={{ item: item, imdbData: imdbData }}><button className='custom-btn w-max px-4 py-2 full-radius'>Watch Now</button></Link>
                    {(myFav != null) &&
                        <div onClick={() => handleFav(items.imdb_id)} role='button' className={myFav.includes(items.imdb_id) ? "theme-clr fs-1 d-flex justify-content-center align-items-center" : "fs-1 d-flex justify-content-center align-items-center"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5C5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1l.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5" opacity=".3" /><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3m-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05" /></svg>
                        </div>}
                    {(myWatchList != null) &&
                        <div onClick={() => handleWatchList(items.imdb_id)} role='button' className={myWatchList.includes(items.imdb_id) ? "theme-clr fs-1 d-flex justify-content-center align-items-center" : "fs-1 d-flex justify-content-center align-items-center"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m7 17.97l5-2.15l5 2.15V5H7z" opacity=".3" /><path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3l7 3V5c0-1.1-.9-2-2-2m0 14.97l-5-2.14l-5 2.14V5h10z" /></svg>
                        </div>}
                </div>


            </div>
        </div>
    )
}

export default Slide
