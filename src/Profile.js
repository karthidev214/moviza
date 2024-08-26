import React, { useState, useRef, useEffect, useCallback } from 'react';
import { auth, provider, database, firestore, storage } from './customHook/useFirebase';
import { useFirestore } from './App'; // Import the hook from App.js
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function Profile() {
    const { documentData } = useFirestore();
    const [user, setUser] = useState(null);

    const [profileEmail, setProfileEmail] = useState('');

    // for Profile Name start
    const [profileName, setProfileName] = useState('karthi');
    const [profileNameUpdate, setProfileNameUpdate] = useState(false);

    const handleProfileName = useCallback((e) => {
        setProfileName(e.target.value);
        if (user.displayName == e.target.value) setProfileNameUpdate(false);
        else setProfileNameUpdate(true);
    }, [profileName])

    const changeProfileName = () => {
        setProfileNameUpdate(false);
        const newUser = JSON.parse(window.localStorage.getItem('user'));
        newUser.displayName = profileName;
        window.localStorage.setItem('user', JSON.stringify(newUser));
        handleProfile({ name: profileName });
    }
    // for Profile Name end

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState('');


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
        }
    };

    const handleUpload = () => {
        if (!image) return;

        const storageRef = ref(storage, `moviza-profile/${profileEmail.replace('@gmail.com', '')}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(Math.floor(progress));
            },
            (error) => {
                console.error('Upload error:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    handleProfile({ url: downloadURL });
                });
            }
        );
    };


    const handleProfile = async (profile) => {
        try {
            await setDoc(doc(firestore, 'moviza_user_data', user.email), {
                ...(profile.url && { profile: profile.url }),
                ...(profile.name && { name: profile.name }),
            }, { merge: true }); // Merge updates with existing document
            window.location.reload();
        } catch (e) {
            alert('Error Updating User Data: ' + e.message);
        }
    }
    useEffect(() => {
        if (window.localStorage.getItem('user')) {
            const userInfo = JSON.parse(window.localStorage.getItem('user'));
            setUser(userInfo)
        }
        console.log(documentData)
    }, [documentData])
    useEffect(() => {
        console.log(user)
        setProfileName((user) ? user.displayName : '')
        setProfileEmail((user) ? user.email : '')
    }, [user])


    return (
        <section className='container mt-5'>
            <div className="row py-5">
                <div className="col-12 p-4">
                    <div className="row">
                        <div className="col-12 pt-5">
                            <h1>Profile Setting</h1>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="d-flex gap-3 align-items-center mt-3">
                                <div className="profile-img position-relative w-max overflow-hidden">
                                    <input className='d-none' hidden id='uploadProfileImg' type="file" onChange={handleImageChange} />
                                    <label for="uploadProfileImg" className="imageUpload"></label>
                                    <img src={(documentData != null) ? (documentData.profile) ? documentData.profile : `https://placehold.co/150x150/yellow/black?text=${documentData.name.slice(0, 1)}` : "https://api.iconify.design/svg-spinners:12-dots-scale-rotate.svg?color=%23ddff00"} alt={(user != null) ? user.displayName : "admin"} />
                                </div>
                                {preview && (
                                    <div className="d-flex gap-3 align-items-center profile-img">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><circle cx="4" cy="12" r="3" fill="#ddff00"><animate id="svgSpinners3DotsScale0" attributeName="r" begin="0;svgSpinners3DotsScale1.end-0.25s" dur="0.75s" values="3;.2;3" /></circle><circle cx="12" cy="12" r="3" fill="#ddff00"><animate attributeName="r" begin="svgSpinners3DotsScale0.end-0.6s" dur="0.75s" values="3;.2;3" /></circle><circle cx="20" cy="12" r="3" fill="#ddff00"><animate id="svgSpinners3DotsScale1" attributeName="r" begin="svgSpinners3DotsScale0.end-0.45s" dur="0.75s" values="3;.2;3" /></circle></svg>
                                        <img src={preview} alt="Selected" />
                                    </div>
                                )}
                            </div>
                            {preview && (
                                <div className="d-flex mt-4">
                                    <button className='custom-btn px-3' onClick={handleUpload}>Upload</button>
                                    {progress > 0 && <h1 className='theme-clr ms-3'>{progress}%</h1>}
                                </div>
                            )}


                            <div className="row mt-3">
                                <div className="col-12 col-md-6 mt-4 d-flex flex-column gap-2">
                                    <div className='theme-clr d-flex align-items-center'><span>Name</span> {profileNameUpdate && <div onClick={changeProfileName} className="tick ms-auto"></div>} </div>
                                    <input value={profileName} onChange={(e) => handleProfileName(e)} placeholder='Name' className='profile-inputs fs-6 rounded-2 py-2 px-3 w-100' type="text" />
                                </div>
                                <div className="col-12 col-md-6 mt-4 d-flex flex-column gap-2">
                                    <div className='theme-clr'><span>Email</span></div>
                                    <input value={profileEmail} disabled placeholder='Email' className='profile-inputs fs-6 rounded-2 py-2 px-3 w-100' type="text" />
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
export default Profile
