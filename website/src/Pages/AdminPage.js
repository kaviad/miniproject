import React, { useEffect } from 'react'
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';

import icon from "../assets/icon.png"
import { toast } from 'react-toastify';

import data from '../data/images/random_coords_with_images.json'
import { DetectedDamages } from '../Components/DetectedDamages';
import { Locations } from '../Components/Locations';

export function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [proxyData, setProxyData] = React.useState(data);
  const db = getFirestore();

  function signout(){
    auth.signOut().then(() => {
      navigate('/login')
    }).catch((error) => {
      console.log(error)
    });
  }

  useEffect(() => {
      async function isAdmin(email) {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
    
        const querySnapshot = await getDocs(q);
        const userDocs = querySnapshot.docs.map(doc => {
            console.log(doc.data())
            return doc.data()
        });
        return userDocs.some(user => user.role === 'admin');
      }

      async function getModelOutputs() {
          const db = getFirestore();
          const modelOutputsRef = collection(db, "images");
          const snapshot = await getDocs(modelOutputsRef);
          const modelOutputs = snapshot.docs.map(doc => doc.data());
          return modelOutputs;
      }

      // getModelOutputs().then(modelOutputs => {
      //     console.log(modelOutputs); 
      // });


      // if(auth.currentUser) {
      //   isAdmin(auth.currentUser.email).then(isAdmin => {
      //     if(!isAdmin) {
      //       navigate('/login')
      //     }
      //   }).then(() => setLoading(false))
      // }else{
      //   navigate('/login')
      // }
  })


  const [currentTab, setCurrentTab] = React.useState('Detected Damages');

  function changeTab(tab){
    setCurrentTab(tab);
  }

  return (
    <div className='admin'>
      {!loading &&
        <>
        <div className='admin-header'>
            
            <div className='logo-title'>
              <img src={icon} alt="icon" />
              <h1>PaveGuardian</h1>
            </div>

            <div className='nav'>
              <button className={currentTab === "Detected Damages"? "active" : ""} onClick={() => changeTab("Detected Damages")}>Detected Damages</button>
              <button className={currentTab === "Locations"? "active" : ""} onClick={() => changeTab("Locations")}>Locations</button>
              <button onClick={signout}>Logout</button>
            </div>

        </div>
        <div className='admin-body'>
          {proxyData && currentTab === "Detected Damages" && <DetectedDamages data={proxyData} />}
          {proxyData && currentTab === "Locations" && <Locations data={proxyData} />}
        </div>
        </>
      }
      {
        loading && <div>Loading...</div>
      }
    </div>
  )
}

