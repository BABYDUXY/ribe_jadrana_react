import React from 'react'
import ListItem from './ListItem';
function SveRibe({backEndData}) {
  return (
    <div class="w-max grid grid-cols-4 m-auto gap-2 mb-20">
    {(typeof backEndData === 'undefined')?(<p>Loading...</p>):(
      backEndData.map((riba, i)=>(
        <ListItem key={i} value={riba}/>
      ))
    )}
  </div>
  )
}

export default SveRibe