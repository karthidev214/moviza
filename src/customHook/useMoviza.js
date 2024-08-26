import React, { useEffect, useState } from 'react';

export function useMoviza() {
    const [moviza, setMoviza] = useState([]); // State to store the fetched data
    const [Imdb, setImdb] = useState([]); // State to store the fetched data
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://nwmtamilplay.github.io/moviza/database/moviza.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMoviza(data); // Store the fetched data in state
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                setError(error.message);
                setLoading(false); // Set loading to false in case of an error
            }
            try {
                const responseImdb = await fetch('https://nwmtamilplay.github.io/moviza/database/imdb_data.json');
                if (!responseImdb.ok) {
                    throw new Error('Network response was not ok');
                }
                const dataImdb = await responseImdb.json();
                setImdb(dataImdb); // Store the fetched data in state
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                setError(error.message);
                setLoading(false); // Set loading to false in case of an error
            }
        };
        fetchData();
    }, []);



    return { loading, error, moviza, Imdb };
}
