import React from 'react'
import { Link } from 'react-router-dom'
import GridItem from './GridItem'

function FavWatchlistItems({ loading, error, moviza, Imdb }) {
    return (
        <section className='container'>
            <div className="row">
                <div className="col-12 gridItems">
                    {(moviza) && (moviza.length > 0) ? moviza.map((item, index) => {
                        return <GridItem key={index} item={item} Imdb={Imdb} ></GridItem>
                    }) : <h1 className='no-data'>No Data Found</h1>}
                </div>
            </div>

        </section>
    )
}

export default FavWatchlistItems
