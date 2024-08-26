import React from 'react'
import { useParams, useLocation, useSearchParams } from 'react-router-dom'
function About() {
    const location = useLocation()
    const [search, setSearch] = useSearchParams();
    function ChangeSearch() {
        setSearch({ q: 100 });
    }
    console.log(search.get('q'))
    const { id } = useParams();
    return (
        <>
            <h1 onClick={ChangeSearch} className='display-1'>About {id}  {location.state} {search.get('q')}</h1>
        </>
    )
}

export default About
