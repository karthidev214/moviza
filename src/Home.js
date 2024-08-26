import React, { useEffect, useState } from 'react'
import Slider from './components/Slider'
import GridItems from './components/GridItems';
import { useFirestore } from './App'; // Import the hook from App.js

function Home({ useMoviza }) {

    const { fav, watchList, handleFav, handleWatchList } = useFirestore(); // Access context values

    const { loading, error, moviza, Imdb } = useMoviza();

    const [slideImdb, setSlideImdb] = useState([])

    useEffect(() => {
        setSlideImdb(Imdb)
    }, [loading, useMoviza])

    return (
        <main>
            <Slider fav={fav} watchList={watchList} loading={loading} error={error} moviza={moviza} Imdb={slideImdb} ></Slider>
            <GridItems link='movies' loading={loading} error={error} moviza={moviza} Imdb={slideImdb} match="Movie" type="type" range={12} title="Movies" ></GridItems>
            <GridItems link='series' loading={loading} error={error} moviza={moviza} Imdb={slideImdb} match="Series" type="type" range={12} title="Series" ></GridItems>
            <GridItems link='anime' loading={loading} error={error} moviza={moviza} Imdb={slideImdb} match="Anime" type="cinematography" range={12} title="Anime" ></GridItems>
            <GridItems link='animation' loading={loading} error={error} moviza={moviza} Imdb={slideImdb} match="Animation" type="cinematography" range={12} title="Animation" ></GridItems>
            <GridItems link='live-action' loading={loading} error={error} moviza={moviza} Imdb={slideImdb} match="Live-Action" type="cinematography" range={12} title="Live Action" ></GridItems>
        </main>
    )
}

export default Home
