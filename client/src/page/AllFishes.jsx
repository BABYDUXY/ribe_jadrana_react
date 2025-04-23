import { useState, useEffect } from "react";
import SveRibe from "../components/SveRibe";
import FilterButtons from "../components/FilterButtons";
import Navigacija from "../components/Navigacija";

function MainPage({ backendData, endpointUrl, setUrl }) {
  return (
    <>
      <Navigacija />
      <FilterButtons endpointUrl={endpointUrl} setUrl={setUrl} />
      <SveRibe backEndData={backendData} />
    </>
  );
}

export default MainPage;
