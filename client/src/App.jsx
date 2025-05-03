import React, { useState, useEffect, createContext } from "react";
import "./css/output.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpecificFish from "./page/SpecificFish";
import AllFishes from "./page/AllFishes";
import Prijava from "./page/Prijava";
import Registracija from "./page/Registracija";
import MojProfil from "./page/MojProfil";
import { EndpointUrlContext } from "./kontekst/EndpointUrlContext";
import ForumObjava from "./page/ForumObjava";

const App = () => {
  const endpointUrl = "http://localhost:5000";
  const [url, setUrl] = useState(endpointUrl);
  const [backendData, setBackendData] = useState([]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AllFishes
          backendData={backendData}
          endpointUrl={endpointUrl}
          setUrl={setUrl}
        />
      ),
    },
    {
      path: "/fish/:id",
      element: <SpecificFish data={backendData} />,
    },
    {
      path: "/prijava",
      element: <Prijava endpointUrl={endpointUrl} />,
    },
    {
      path: "/registracija",
      element: <Registracija endpointUrl={endpointUrl} />,
    },
    {
      path: "/mojprofil",
      element: <MojProfil />,
    },
    {
      path: "/ulovi",
      element: <ForumObjava />,
    },
  ]);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setBackendData(data);
      });
  }, [url]);

  return (
    <>
      <EndpointUrlContext.Provider value={{ endpointUrl, setUrl, backendData }}>
        <RouterProvider router={router} />
      </EndpointUrlContext.Provider>
    </>
  );
};
export default App;
