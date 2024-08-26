import React, { useEffect, useState } from 'react'
import './css/play.css'
import { useFirestore } from './App'; // Import the hook from App.js
import { useParams, useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom'
import Player from './Player';

function Play() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPlayer, setShowPlayer] = useState(false)
    if (location.state == null) {
        navigate('/', { replace: true });
    }
    const goToTop = () => {
        setShowPlayer(true)
        document.documentElement.scrollTop = 0;
    }
    const { fav, watchList, handleFav, handleWatchList } = useFirestore(); // Access context values
    const { item, imdbData } = location.state || {};
    useEffect(() => {
        if ((location.state != null)) {
            console.log(item, imdbData)
            let style = document.createElement('style');
            style.innerHTML =
                `body {
    background-image: url(${item['banner-img']});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 100vh;
    position: relative;
    isolation: isolate;
    background-attachment: fixed;
}

body::before {
    content: '';
    position: fixed;
    left:0;
    top:0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: -1;
    backdrop-filter: blur(5px);
}
header {
background-color: transparent !important;
}    
`
            // Change body background color when the component mounts
            document.head.append(style)

            // Clean up the background color when the component unmounts
            return () => {
                style.remove()
            };
        }
    }, []);
    return (
        <section className='container pt-5'>
            {(location.state != null) &&
                <div className="row pt-5">
                    <div className="col-12 mt-xl-5">
                        <div className="row justify-content-center">
                            {showPlayer && <div className="col-12 mb-5">
                                <Player item={item} ></Player>
                            </div>}

                            <div className="col-xl-4 p-xl-5 py-5 d-flex justify-content-center align-items-start">
                                <img src={imdbData.Poster} alt="" />
                            </div>
                            <div className="col-xl-8 p-xl-5 p-3 d-flex flex-column gap-2">
                                <h4 className='theme-clr'>{item.type}</h4>
                                {(imdbData != null) && <h6 className='d-flex flex-wrap gap-3 genre'>{imdbData.Genre.split(', ').map((genre, i) => (<span key={i} role='button'>{genre}</span>))}</h6>}
                                <h1 className='display-3 fw-bold text-balance'>{item.title}</h1>
                                {(imdbData != null) && <>
                                    <p className='text-balance'>{imdbData.Plot}</p>

                                    <div className='info d-flex gap-1 align-items-center'>
                                        <h6 className='m-0'>{imdbData.Released}</h6>
                                        <svg className='theme-clr' xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 256 256"><g fill="currentColor"><path d="M176 128a48 48 0 1 1-48-48a48 48 0 0 1 48 48" opacity=".2" /><path d="M140 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12" /></g></svg>
                                        <h6 className='m-0'>{imdbData.Rated}</h6>
                                        <svg className='theme-clr' xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 256 256"><g fill="currentColor"><path d="M176 128a48 48 0 1 1-48-48a48 48 0 0 1 48 48" opacity=".2" /><path d="M140 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12" /></g></svg>
                                        <h6 className='m-0'>{imdbData.Runtime}</h6>
                                    </div>

                                </>}
                                {(imdbData != null) &&
                                    <div style={{ "--rating": (imdbData.imdbRating / 2) }} className='rating d-flex gap-2 align-items-center'>
                                        <div></div>
                                        {imdbData.imdbRating}/10 Rating
                                    </div>}

                                <div className="d-xl-flex d-none flex-column gap-2 mt-3">
                                    <h6 className='text-balance'><span className='theme-clr'>Director :</span> {imdbData.Director}</h6>
                                    <h6 className='text-balance'><span className='theme-clr'>Actors :</span> {imdbData.Actors}</h6>
                                    <h6 className='text-balance'><span className='theme-clr'>BoxOffice :</span> {imdbData.BoxOffice}</h6>
                                </div>
                                <div className='d-flex gap-4 align-items-center mt-4'>
                                    <button onClick={goToTop} className='custom-btn w-max px-4 py-2 full-radius'>Play Now</button>
                                    {(fav.length > 0) &&
                                        <div onClick={() => handleFav(item.imdb_id)} role='button' className={fav.includes(item.imdb_id) ? "theme-clr fs-1 d-flex justify-content-center align-items-center" : "fs-1 d-flex justify-content-center align-items-center"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5C5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1l.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5" opacity=".3" /><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3m-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05" /></svg>
                                        </div>}
                                    {(watchList.length > 0) &&
                                        <div onClick={() => handleWatchList(item.imdb_id)} role='button' className={watchList.includes(item.imdb_id) ? "theme-clr fs-1 d-flex justify-content-center align-items-center" : "fs-1 d-flex justify-content-center align-items-center"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m7 17.97l5-2.15l5 2.15V5H7z" opacity=".3" /><path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3l7 3V5c0-1.1-.9-2-2-2m0 14.97l-5-2.14l-5 2.14V5h10z" /></svg>
                                        </div>}
                                </div>



                            </div>
                        </div>
                    </div>
                </div>}
        </section>
    )
}

export default Play
