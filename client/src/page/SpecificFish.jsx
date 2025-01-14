import React from 'react'
import { useParams } from 'react-router-dom'
import FishAllInfo from '../components/FishAllInfo';

function SpecificFish({data}) {

  const params = useParams();

  return (
    <>
    {data.map((riba)=>( 
      (riba.ID == params.id)?(
      
      <FishAllInfo value={riba}/>

    ):""
  ))}
    
    </>
  )
}

export default SpecificFish