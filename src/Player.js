import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

const Player = ({ item }) => {
    const playerVideo = useRef(null);
    const [season, setSeason] = useState(null);
    const [poster, setPoster] = useState('https://placehold.co/1920x1080/black/yellow?text=Moviza+App');
    const [source, setSource] = useState([]);

    const getEpisodeSources = useCallback((seasonNumber, episodeNumber) => {
        const seasonData = item.seasons.find(season => season.season === seasonNumber);
        if (!seasonData) return null;

        const episode = seasonData.episodes.find(ep => ep.episode === episodeNumber);
        return episode ? episode.source : null;
    }, [item]);

    const activeSeason = useCallback((seasonNumber) => {
        setSeason(prev => prev.map(season => ({
            ...season,
            active: season.season === seasonNumber ? !season.active : season.active
        })));
    }, []);

    const activeEpisode = useCallback((episodeNumber, onstart) => {
        setSeason(prev => prev.map(season => ({
            ...season,
            episodes: season.episodes.map(episode => {
                if (episode.episode === episodeNumber) {
                    window.localStorage.setItem(`play-${item.imdb_id}`, JSON.stringify([{ season: season.season, episode: episode.episode }]));
                    setPoster(`https://placehold.co/1920x1080/black/yellow?text=${item.title}%0ASeason${season.season}+Episode${episode.episode}`);

                    const newSource = episode.source.map(s => ({
                        src: s.src,
                        type: 'video/mp4',
                        size: s.quality,
                    }));
                    setSource(newSource);

                    return { ...episode, active: true };
                } else {
                    return { ...episode, active: false };
                }
            })
        })));

        if (!onstart) {
            setTimeout(() => {
                playerVideo.current.plyr.play();
            }, 1000);
        }
    }, [item]);

    useEffect(() => {
        if (item.type === 'Movie') setPoster(`https://placehold.co/1920x1080/black/yellow?text=${item.title}%0A`);
        if (item.type === 'Series') setPoster(`https://placehold.co/1920x1080/black/yellow?text=${item.title}%0ASeason${1}+Episode${1}`);

        if (item.type === 'Movie') {
            const newSource = item.source.map(s => ({
                src: s.src,
                type: 'video/mp4',
                size: s.quality,
            }));
            setSource(newSource);
        }
        if (item.type === 'Series') {
            if (window.localStorage.getItem(`play-${item.imdb_id}`)) {
                const localPlay = JSON.parse(window.localStorage.getItem(`play-${item.imdb_id}`));
                setPoster(`https://placehold.co/1920x1080/black/yellow?text=${item.title}%0ASeason${localPlay[0].season}+Episode${localPlay[0].episode}`);

                if (localPlay[0].episode !== 1) {
                    setTimeout(() => {
                        activeEpisode(localPlay[0].episode, true);
                    }, 500);
                }

                const newSource = item.seasons[localPlay[0].season - 1].episodes[localPlay[0].episode - 1].source.map(s => ({
                    src: s.src,
                    type: 'video/mp4',
                    size: s.quality,
                }));
                setSource(newSource);
            } else {
                const newSource = item.seasons[0].episodes[0].source.map(s => ({
                    src: s.src,
                    type: 'video/mp4',
                    size: s.quality,
                }));
                setSource(newSource);
            }
        }
        if (item.type === 'Series') {
            setSeason(item.seasons.map((season, index) => {
                const episodes = season.episodes.map((episode, i) => ({
                    ...episode,
                    active: index === 0 && i === 0,
                }));
                return {
                    season: season.season,
                    episodes,
                    active: index === 0,
                };
            }));
        }
    }, [item, activeEpisode]);

    const videoOptions = useMemo(() => ({
        type: 'video',
        sources: source,
        poster: poster,
    }), [source, poster]);

    return (
        <div>
            <Plyr ref={playerVideo} source={videoOptions} />
            <div className='d-flex gap-3 flex-column mt-3'>
                {item.type === 'Series' && season && season.map(season => (
                    <div key={season.season}>
                        <button onClick={() => activeSeason(season.season)} className={season.active ? 'active btn seasons p-2 rounded-2 w-100' : 'btn seasons p-2 rounded-2 w-100'}>
                            Season {season.season}
                        </button>
                        <div className='d-flex justify-content-center gap-3 flex-wrap mt-3'>
                            {season.active && season.episodes.map(episode => (
                                <button key={episode.episode} onClick={() => activeEpisode(episode.episode, false)} className={episode.active ? 'active btn seasons p-2 rounded-2' : 'btn seasons p-2 rounded-2'}>
                                    Ep {episode.episode}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Player;
