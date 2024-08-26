import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFirestore } from '../App'; // Import the hook from App.js
function GridItem({ item, Imdb }) {
    const { fav, watchList, handleFav, handleWatchList } = useFirestore(); // Access context values

    const [myFav, setMyFav] = useState(null);
    const [myWatchList, setMyWatchList] = useState(null);
    useEffect(() => {
        setMyFav(fav)
        setMyWatchList(watchList)
    }, [fav, watchList])

    const [imdbData, setImdbData] = useState(null);
    useEffect(() => {
        setImdbData(() => {
            return Imdb.filter(itemImdb => itemImdb.imdbID == item.imdb_id)[0];
        });
        // Initialize tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
    }, [imdbData, Imdb, item])
    return (
        <div className='gridItem w-100 d-flex ' style={{ "--bg": `url(${(imdbData != null) && imdbData.Poster})` }}>
            <div className="position-absolute gap-1 px-2 py-4 top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end align-items-center">
                {(imdbData != null) && <h6 data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={"Released " + imdbData.Released} className='m-0 small-font theme-clr'>{imdbData.Year}</h6>}
                <h6 className='text-center text-balance'>{item.title}</h6>
                {(imdbData != null) &&
                    <div className='info d-flex gap-1 flex-wrap align-items-center  justify-content-center'>
                        <h6 className='m-0 small-font'>{imdbData.Rated}</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="currentColor"><path d="M176 128a48 48 0 1 1-48-48a48 48 0 0 1 48 48" opacity=".2" /><path d="M140 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12" /></g></svg>
                        <h6 className='m-0 small-font'>{imdbData.Runtime}</h6>
                    </div>}
            </div>
            <div className="d-flex play position-absolute top-0 start-0 w-100 h-100 justify-content-center align-items-center">
                <Link to='../play' state={{ item: item, imdbData: imdbData }}><button className='custom-btn w-max full-radius fs-3 px-2'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712" /></svg></button></Link>
                {(myFav != null) &&
                    <div onClick={() => handleFav(item.imdb_id)} role='button' className={myFav.includes(item.imdb_id) ? "theme-clr w-max position-absolute top-0 start-0 ms-2 mt-2  fs-3 d-flex justify-content-center align-items-center" : "w-max position-absolute top-0 start-0 ms-2 mt-2  fs-3 d-flex justify-content-center align-items-center"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5C5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1l.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5" opacity=".3" /><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3m-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05" /></svg>
                    </div>}
                {(myWatchList != null) &&
                    <div onClick={() => handleWatchList(item.imdb_id)} role='button' className={myWatchList.includes(item.imdb_id) ? "theme-clr w-max position-absolute top-0 end-0 me-2 mt-2  fs-3 d-flex justify-content-center align-items-center" : "w-max position-absolute top-0 end-0 me-2 mt-2  fs-3 d-flex justify-content-center align-items-center"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m7 17.97l5-2.15l5 2.15V5H7z" opacity=".3" /><path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3l7 3V5c0-1.1-.9-2-2-2m0 14.97l-5-2.14l-5 2.14V5h10z" /></svg>
                    </div>}
            </div>
        </div>
    )
}

export default GridItem
