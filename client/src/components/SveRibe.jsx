import React from "react";
import ListItem from "./ListItem";
function SveRibe({ backEndData }) {
  return (
    <div class="w-max grid grid-cols-1 m-auto gap-6 mb-20  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
      {typeof backEndData === "undefined" ? (
        <p>Loading...</p>
      ) : (
        backEndData.map((riba, i) => <ListItem key={i} value={riba} />)
      )}
    </div>
  );
}

export default SveRibe;
