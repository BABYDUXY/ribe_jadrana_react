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
import NovaObjava from "./page/NovaObjava";
import MojaSviđanja from "./page/MojaSviđanja";
import MojiUlovi from "./page/MojiUlovi";
import Novosti from "./page/Novosti";
import AdminPanel from "./page/AdminPanel";

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
    {
      path: "/novaobjava",
      element: <NovaObjava />,
    },
    {
      path: "/mojasvidanja",
      element: <MojaSviđanja />,
    },
    {
      path: "/mojiulovi",
      element: <MojiUlovi />,
    },
    {
      path: "/novosti",
      element: <Novosti />,
    },
    {
      path: "/adminpanel",
      element: <AdminPanel />,
    },
  ]);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setBackendData(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Greška kod fetch-a:", err);
        setBackendData([]);
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
