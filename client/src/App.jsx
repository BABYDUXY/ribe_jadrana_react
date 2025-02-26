import React, { useState, useEffect, createContext } from 'react';
import './css/output.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SpecificFish from './page/SpecificFish';
import MainPage from './page/MainPage';



export const RandContext = createContext();



const App = () => {
  const endpointUrl="http://localhost:5000";
  const [url, setUrl]=useState(endpointUrl);
  const [backendData, setBackendData] = useState([{}]);
  const [broj ,SetBroj]=useState(0);

  
  

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RandContext.Provider value={broj}><MainPage backendData={backendData} endpointUrl={endpointUrl} setUrl={setUrl}/></RandContext.Provider>,
    },
    {
      path: "/fish/:id",
      element: <RandContext.Provider value={broj}><SpecificFish data={backendData}/></RandContext.Provider>,
    },
  ]);

  
  useEffect(() => { 
  fetch(`${endpointUrl}/broj`)
  .then( res => res.json())
  .then((data) => {
    SetBroj(data[0]["COUNT(ID)"]);
  })
    },[]);

    useEffect(() => { 
      fetch(url)
        .then( res => res.json())
        .then((data) => {
          setBackendData(data);
          console.log(data);
        })
        
    }, [url])


    
  return (
    <><RouterProvider router={router} />
    </>
  );
};
export default App;