import React from 'react'
import { Link } from 'react-router-dom'
import GridItem from './GridItem'
import { useFirestore } from '../App'; // Import the hook from App.js

function GridItems({ loading, error, moviza, Imdb, match, type, range, title, link }) {
    const { fav, watchList, handleFav, handleWatchList } = useFirestore(); // Access context values
    let start = 0;
    return (
        <section className='container'>
            <div className="row">
                {(title) && <div className="col-12 py-5 px-3 d-flex justify-content-between align-items-center">
                    <h3><span className='theme-clr'>#</span>{title}</h3>
                    <Link to={link}>See All</Link>
                </div>}
                <div className="col-12 gridItems">
                    {(moviza) && (moviza.length > 0) ? moviza.map((item, index) => {
                        if (start < range) {
                            if (item[type] == match) {
                                start++;
                                return <GridItem key={index} item={item} Imdb={Imdb} ></GridItem>
                            }
                        }
                    }) : <h1 className='no-data'>No Data Found</h1>}
                </div>
            </div>

        </section>
    )
}

export default GridItems
