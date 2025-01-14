import { useState, useEffect } from 'react';
import SveRibe from '../components/SveRibe';
import FilterButtons from '../components/FilterButtons';

function MainPage({backendData, endpointUrl, setUrl}) {

    
  return (
    <>
    <h1 className="mb-20 text-5xl text-center mt-14">Ribe Jadrana</h1>
    <FilterButtons endpointUrl={endpointUrl} setUrl={setUrl}/>
    <SveRibe backEndData={backendData}/>
    </>
  )
}

export default MainPage