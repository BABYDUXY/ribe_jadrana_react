import React, { useState, useEffect, createContext } from "react";
import "./css/output.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpecificFish from "./page/SpecificFish";
import AllFishes from "./page/AllFishes";
import Navigacija from "./components/Navigacija";

/* export const RandContext = createContext(); */

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
      element: <Navigacija />,
    },
  ]);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setBackendData(data);
        console.log(data);
      });
  }, [url]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
export default App;
