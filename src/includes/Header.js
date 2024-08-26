import React, { useEffect, useRef, useState } from 'react'
import logo from '../images/logo.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useFirestore } from '../App'; // Import the hook from App.js
import { useMoviza } from '../customHook/useMoviza'; // Import the custom hook
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
function Header({ user }) {

    const navigate = useNavigate();

    const { loading, error, moviza, Imdb } = useMoviza();

    const { fav, watchList, handleFav, handleWatchList } = useFirestore(); // Access context values
    const [myFav, setMyFav] = useState(null);
    const [myWatchList, setMyWatchList] = useState(null);
    useEffect(() => {
        setMyFav(fav)
        setMyWatchList(watchList)
    }, [fav, watchList])

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = (e) => {
        setSearchResult([]);
        setSearch(e.target.value);
        if (e.target.value.trim() != "") {
            const result = moviza.filter(m => m.title.toLowerCase().includes(e.target.value) || m.detail.toLowerCase().includes(e.target.value));
            console.log(result)
            setSearchResult(result);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (search.trim() != "") {
                setSearch('');
                setSearchResult([]);
                navigate('/search', {
                    state: { searchText: search, },
                    replace: true
                });
            }
        }
    };

    const getDataById = (id) => {
        const movizaData = moviza.filter(m => m.imdb_id == id);
        const ImdbData = Imdb.filter(m => m.imdbID == id);
        return { moviza: movizaData, imdb: ImdbData }
    }

    const header = useRef(null)

    const { documentData } = useFirestore(); // Access context values

    const [profile, setProfile] = useState(null);
    const [userData, setUserData] = useState(null);

    const menuBtn = useRef(null);
    const menu = useRef(null);


    useEffect(() => {
        if (menu.current) {
            if (menu.current.classList.contains('active')) {
                menu.current.classList.remove('active');
            }
        }
    }, [navigate]);

    const handleMenu = () => {
        if (menu.current) {
            menu.current.classList.toggle('active');
        }
    }
    useEffect(() => {

        setProfile(user)
        setUserData(documentData)
        // console.log(profile.photoURL)
        const handleClickOutside = (e) => {
            // Check if the click is outside the menu and the toggle button
            if (
                menu.current &&
                !menu.current.contains(e.target) &&
                menuBtn.current &&
                !menuBtn.current.contains(e.target)
            ) {
                menu.current.classList.remove('active');
            }
        };
        // Add event listener to the document
        document.addEventListener('click', handleClickOutside);
        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [user, documentData]);

    useEffect(() => {
        let lastScrollTop = 0;
        window.addEventListener('scroll', function () {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (lastScrollTop > 200) {
                if (header.current) header.current.classList.add('not-top')
                if (scrollTop > lastScrollTop) {
                    if (header.current) header.current.classList.remove('show')
                } else {
                    if (header.current) header.current.classList.add('show')
                }
            } else {
                if (header.current) header.current.classList.remove('not-top')
            }
            lastScrollTop = scrollTop;
        });
    }, [header])

    return (
        <header ref={header} className='w-100'>
            <nav className='container p-3'>
                <div className="row">
                    <div className="col-12 d-flex align-items-center">
                        <NavLink className="logo me-auto" to="/"><img className='w-100' src={logo} alt="" /></NavLink>
                        <div ref={menu} className="navigation d-flex flex-column flex-xl-row align-items-xl-center justify-content-center gap-4 p-4 p-xl-0">
                            <NavLink className='d-flex gap-3 align-items-center' to="/"><svg className='fs-4 d-flex d-xl-none' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 14.85V11q0-.2.075-.375T4.3 10.3l7-7q.15-.15.325-.225Q11.8 3 12 3t.375.075q.175.075.325.225l1.425 1.4ZM17 20v-8.175L13.075 7.9L15.2 5.775l4.5 4.525q.125.15.213.325Q20 10.8 20 11v8q0 .425-.288.712Q19.425 20 19 20ZM5 20q-.425 0-.713-.288Q4 19.425 4 19v-2.05l3-3V17h8.5v3Z" /></svg>Home</NavLink>
                            <NavLink className='d-flex gap-3 align-items-center' to="/about"> <svg className='fs-4 d-flex d-xl-none' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18.001 20H20v2h-8C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10a9.99 9.99 0 0 1-3.999 8M12 10a2 2 0 1 0 0-4a2 2 0 0 0 0 4m-4 4a2 2 0 1 0 0-4a2 2 0 0 0 0 4m8 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4m-4 4a2 2 0 1 0 0-4a2 2 0 0 0 0 4" /></svg>About</NavLink>
                            <NavLink className='d-flex gap-3 align-items-center' to="/movies"><svg className='fs-4 d-flex d-xl-none' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m20.84 2.18l-3.93.78l2.74 3.54l1.97-.4zm-6.87 1.36L12 3.93l2.75 3.53l1.96-.39zm-4.9.96l-1.97.41l2.75 3.53l1.96-.39zm-4.91 1l-.98.19a2 2 0 0 0-1.57 2.35L2 10l4.9-.97zM2 10v10a2 2 0 0 0 2 2h16c1.11 0 2-.89 2-2V10z" /></svg> Movies</NavLink>
                            <NavLink className='d-flex gap-3 align-items-center' to="/series"><svg className='fs-4 d-flex d-xl-none' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m11.05 14.5l4.15-2.65q.45-.3.45-.85t-.45-.85L11.05 7.5q-.5-.325-1.025-.05t-.525.875v5.35q0 .6.525.875t1.025-.05M4 19q-.825 0-1.412-.587T2 17V5q0-.825.588-1.412T4 3h16q.825 0 1.413.588T22 5v12q0 .825-.587 1.413T20 19h-4v1q0 .425-.288.713T15 21H9q-.425 0-.712-.288T8 20v-1z" /></svg> Series</NavLink>
                            <NavLink className='d-flex gap-3 align-items-center' to="/anime"><svg className='fs-4 d-flex d-xl-none' xmlns="http://www.w3.org/2000/svg" width="0.95em" height="0.95em" viewBox="0 0 512 512"><path fill="currentColor" d="m368.256 214.573l-102.627 187.35c40.554 71.844 73.647 97.07 138.664 94.503c63.67-2.514 136.974-89.127 95.694-163.243L397.205 150.94c-3.676 12.266-25.16 55.748-28.95 63.634M216.393 440.625C104.077 583.676-57.957 425.793 20.85 302.892c0 0 83.895-147.024 116.521-204.303c25.3-44.418 53.644-72.37 90.497-81.33c44.94-10.926 97.565 12.834 125.62 56.167c19.497 30.113 36.752 57.676 6.343 109.738c-3.613 6.184-136.326 248.402-143.438 257.46m8.014-264.595c-30.696-17.696-30.696-62.177 0-79.873s69.273 4.544 69.273 39.936s-38.578 57.633-69.273 39.937" /></svg> Anime</NavLink>
                            <NavLink className='d-flex gap-3 align-items-center' to="/favorite"><svg role='button' className='fs-4' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20.325q-.35 0-.712-.125t-.638-.4l-1.725-1.575q-2.65-2.425-4.788-4.812T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.325 0 2.5.562t2 1.538q.825-.975 2-1.537t2.5-.563q2.35 0 3.925 1.575T22 8.15q0 2.875-2.125 5.275T15.05 18.25l-1.7 1.55q-.275.275-.637.4t-.713.125" /></svg> <span className='w-max d-flex d-xl-none'>Favorite</span></NavLink>
                            <NavLink className='d-flex gap-3 align-items-center' to="/watch-list"><svg role='button' className='fs-4' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 18l-4.2 1.8q-1 .425-1.9-.162T5 17.975V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v12.975q0 1.075-.9 1.663t-1.9.162z" /></svg> <span className='w-max d-flex d-xl-none'>Watch List</span></NavLink>
                            <NavLink className='d-flex gap-3 align-items-center' to="/search"><svg role='button' className='fs-4' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg> <span className='w-max d-flex d-xl-none'>Search</span></NavLink>
                            <div className="position-relative search-box d-none d-xl-flex">
                                <input onKeyDown={handleKeyDown} name='s' placeholder='Search' value={search} onChange={(e) => handleSearch(e)} className='search full-radius py-2 px-3' type="text" />
                                <div className="searchResult scroll-box">
                                    {searchResult.map(result => {
                                        const imdbDatas = getDataById(result.imdb_id);
                                        console.log(imdbDatas)
                                        return <div className='result-items m-3'>
                                            <img className='w-100' src={imdbDatas.imdb[0].Poster} alt="" />
                                            <div className="details d-flex flex-column gap-1 p-3">
                                                <span className='theme-clr small-font'>{result.type}</span>
                                                <h6 className='fs-6'>{result.title}</h6>
                                                <div className="d-flex w-100 gap-2 align-items-center mt-auto">
                                                    {(myFav != null) &&
                                                        <div onClick={() => handleFav(result.imdb_id)} role='button' className={myFav.includes(result.imdb_id) ? "theme-clr fs-4 d-flex justify-content-center align-items-center" : "fs-4 d-flex justify-content-center align-items-center"}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5C5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1l.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5" opacity=".3" /><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3m-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05" /></svg>
                                                        </div>}
                                                    {(myWatchList != null) &&
                                                        <div onClick={() => handleWatchList(result.imdb_id)} role='button' className={myWatchList.includes(result.imdb_id) ? "theme-clr fs-4 d-flex justify-content-center align-items-center" : "fs-4 d-flex justify-content-center align-items-center"}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m7 17.97l5-2.15l5 2.15V5H7z" opacity=".3" /><path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3l7 3V5c0-1.1-.9-2-2-2m0 14.97l-5-2.14l-5 2.14V5h10z" /></svg>
                                                        </div>}
                                                    <Link to='../play' onClick={() => { setSearch(''); setSearchResult([]); }} className='ms-auto' state={{ item: result, imdbData: imdbDatas.imdb[0] }}><button className="result-btn w-max btn">Watch Now</button></Link>
                                                </div>
                                            </div>
                                        </div>
                                    })}

                                </div>
                            </div>
                        </div>
                        <Link to="/profile">
                            <img
                                role='button'
                                className='profile full-radius ms-5' src={(userData != null) ? (userData.profile) ? userData.profile : `https://placehold.co/40x40/yellow/black?text=${userData.name.slice(0, 1)}` : "https://api.iconify.design/svg-spinners:12-dots-scale-rotate.svg?color=%23ddff00"} alt={(profile != null) ? profile.displayName : "admin"} /></Link>
                        <button ref={menuBtn} onClick={handleMenu} className="menu ms-3 d-flex d-xl-none"><svg className='fs-1' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1" /></svg></button>
                    </div>
                </div>
            </nav>
        </header >
    )
}

export default Header
