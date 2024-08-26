import { useEffect, useState, createContext, useContext } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Links from './Links';
import Header from './includes/Header';
// import Footer from './includes/Footer';
import { useMoviza } from './customHook/useMoviza';
import Lists from './Lists';
import Login from './Login';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from './customHook/useFirebase';
import FavWatchList from './FavWatchList';
import Play from './Play';
import Search from './Search';
import Profile from './Profile';

const FirestoreContext = createContext();
export const useFirestore = () => useContext(FirestoreContext);

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.localStorage.getItem('user')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const [user, setUser] = useState(null)

  const location = useLocation();
  const { message, fromSignIn } = location.state || {};

  const [documentData, setDocumentData] = useState(null);
  const [fav, setFav] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [error, setError] = useState('');

  const handleReload = () => {
    window.location.reload();
    navigate('/', { replace: true });
  };

  const handleFav = async (id) => {
    if (fav.includes(id)) {
      let pop = fav.filter(f => f != id)
      let newFav = [...new Set(pop)];
      setFav(newFav)
      try {
        await setDoc(doc(firestore, 'moviza_user_data', user.email), {
          ...({ favData: newFav }),
        }, { merge: true }); // Merge updates with existing document
      } catch (e) {
        alert('Error Updating User Data: ' + e.message);
      }
    } else {
      let newFav = [...new Set([...fav, id])];
      setFav(newFav)
      try {
        await setDoc(doc(firestore, 'moviza_user_data', user.email), {
          ...({ favData: newFav }),
        }, { merge: true }); // Merge updates with existing document
      } catch (e) {
        alert('Error Updating User Data: ' + e.message);
      }
    }
  }
  const handleWatchList = async (id) => {
    if (watchList.includes(id)) {
      let pop = watchList.filter(f => f != id)
      let newWatchList = [...new Set(pop)];
      setWatchList(newWatchList)
      try {
        await setDoc(doc(firestore, 'moviza_user_data', user.email), {
          ...({ watchList: newWatchList }),
        }, { merge: true }); // Merge updates with existing document
      } catch (e) {
        alert('Error Updating User Data: ' + e.message);
      }
    } else {
      let newWatchList = [...new Set([...fav, id])];
      setWatchList(newWatchList)
      try {
        await setDoc(doc(firestore, 'moviza_user_data', user.email), {
          ...({ watchList: newWatchList }),
        }, { merge: true }); // Merge updates with existing document
      } catch (e) {
        alert('Error Updating User Data: ' + e.message);
      }
    }
  }

  const handleUpdate = async (email, name = null, favData = null, watchList = null) => {
    try {
      await setDoc(doc(firestore, 'moviza_user_data', email), {
        ...(name && { name }),
        ...(favData && { favData }),
        ...(watchList && { watchList })
      }, { merge: true }); // Merge updates with existing document
    } catch (e) {
      alert('Error Updating User Data: ' + e.message);
    }
  };
  const handleRead = async (email) => {
    if (email) {
      try {
        const docRef = doc(firestore, 'moviza_user_data', email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocumentData(docSnap.data());
          console.log(docSnap.data())
          setFav(docSnap.data().favData)
          setWatchList(docSnap.data().watchList)
          setError('');
        } else {
          setError('No such document!');
        }
      } catch (e) {
        console.error('Error reading document: ', e);
        setError('Error reading document: ' + e.message);
      }
    } else {
      setError('Please provide a document ID.');
    }
  };

  useEffect(() => {

    if (window.localStorage.getItem('user')) {
      const userInfo = JSON.parse(window.localStorage.getItem('user'));
      // console.log(userInfo.email)
      setUser(userInfo)
      handleRead(userInfo.email);
    }

    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
  }, [navigate])
  return (
    <FirestoreContext.Provider value={{ fav, watchList, handleFav, handleWatchList, documentData, handleRead }}>
      <Header user={user}></Header>
      <Routes>
        <Route path='/' element={<Home useMoviza={useMoviza} />}></Route>
        <Route path='/about' element={<Links />}></Route>
        <Route path='/movies' element={<Lists useMoviza={useMoviza} queryCheck={["cinematography", "cat"]} check='type' types='Movie' />}></Route>
        <Route path='/series' element={<Lists useMoviza={useMoviza} queryCheck={["cinematography", "cat"]} check='type' types='Series' />}></Route>
        <Route path='/anime' element={<Lists useMoviza={useMoviza} queryCheck={["type", "type"]} check='cinematography' types='Anime' />}></Route>
        <Route path='/animation' element={<Lists useMoviza={useMoviza} queryCheck={["type", "type"]} check='cinematography' types='Animation' />}></Route>
        <Route path='/live-action' element={<Lists useMoviza={useMoviza} queryCheck={["type", "type"]} check='cinematography' types='Live-Action' />}></Route>
        <Route path='/favorite' element={<FavWatchList useMoviza={useMoviza} forWhat='fav' />}></Route>
        <Route path='/watch-list' element={<FavWatchList useMoviza={useMoviza} forWhat='watchList' />}></Route>
        <Route path='/play' element={<Play />}></Route>
        <Route path='/login' element={<Login handleUpdate={handleUpdate} />}></Route>
        <Route path='/search' element={<Search handleUpdate={handleUpdate} />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/testing/:id' element={<About />}></Route>
      </Routes>
      <h1> {fromSignIn && <div className='startApp'>
        {message}
        <button onClick={handleReload} className='custom-btn fs-5 w-max px-4 py-2 full-radius'>Start</button>
      </div>}

      </h1>
      {/* <Footer></Footer> */}
    </FirestoreContext.Provider>
  );
}

export default App;
