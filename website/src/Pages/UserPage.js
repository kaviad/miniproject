import React, { useEffect } from 'react';

import { auth } from '../Firebase'; // import your firebase config
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

import EXIF from 'exif-js';

import upload from '../assets/file upload.png';
import illustration from '../assets/upload illustration.jpg'
import icon from "../assets/icon.png"
import loader from "../assets/spinner.svg"

export function UserPage() {
    const user = auth.currentUser;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    function signout(){
        auth.signOut().then(() => {
          navigate('/login')
        }).catch((error) => {
          console.log(error)
        });
    }

    useEffect(() => {
        // Not Logged in properly
        if(!user){
            navigate('/login');
        }

        const container = document.querySelector('.upload-main-content');
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('dragleave', handleDragLeave);
        container.addEventListener('drop', handleDrop);

        return () => {
            container.removeEventListener('dragover', handleDragOver);
            container.removeEventListener('dragleave', handleDragLeave);
            container.removeEventListener('drop', handleDrop);
        };
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        document.querySelector('.upload-container').style.transform = 'scale(1.2)';
    };

    const handleDragLeave = () => {
        document.querySelector('.upload-container').style.transform = 'scale(1)';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        document.querySelector('.upload-container').style.transform = 'scale(1)';

        if (e.dataTransfer.files.length > 0) {
            // Handle the dropped files here
            handleFiles(e.dataTransfer.files);
        }
    };

    function handleFiles(files){
        for(let i = 0; i < files.length; i++) {
            EXIF.getData(files[i], function() {
                var lat = EXIF.getTag(this, "GPSLatitude");
                var long = EXIF.getTag(this, "GPSLongitude");
    
                if(lat && long) {
                    // Convert coordinates to decimal
                    var latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";  
                    var longRef = EXIF.getTag(this, "GPSLongitudeRef") || "W";
                    lat = (lat[0] + lat[1]/60 + lat[2]/3600) * (latRef == "N" ? 1 : -1);
                    long = (long[0] + long[1]/60 + long[2]/3600) * (longRef == "W" ? -1 : 1);
    
                    toast.success(`Latitude: ${lat}, Longitude: ${long}`);
                } else {
                    lat = "";
                    long = "";
                    toast.error('No GPS data found for this image.');
                }
            });

            // getBase64(file).then(data => console.log(data));
        }
    }

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function getImage(base64String){
        return (<img src={base64String} alt="From base64" />);
    }

    return (
        <div className='upload'>
                <div className='upload-heading'>
                    <div>
                        <img src={icon} alt="" />
                        <h1>Nova Spark</h1>
                    </div>
                    
                    <button onClick={signout}>
                        Logout
                        <FaSignOutAlt />    
                    </button>
                </div>

                <div className ='upload-main-content'>
                    <div className='upload-content'>
                        {!isLoading ? 
                            <>
                            <h2>Upload images and scan for damaged roads</h2>
                            <div className='upload-container'>
                                <label className="upload-label">
                                    <img src={upload} alt="" />
                                    <input 
                                        type="file" 
                                        onChange={(event) => {
                                            const files = event.target.files;
                                            if (files.length > 0) {
                                                handleFiles(files);
                                            }
                                        }}  
                                        style={{ display: 'none' }} 
                                    />                           
                                    <p>UPLOAD / DRAG AND DROP IMAGES</p>
                                </label>
                            </div> 
                            </> :
                            <div className='loader-container'>
                                <img style={{height:"100px"}} src={loader} alt="xcvdx" />
                            </div>
                        }
                    </div>
                    <div className='upload-image-container'>
                        <img src={illustration} alt="" />
                    </div>
            </div>
        </div>
    );
}