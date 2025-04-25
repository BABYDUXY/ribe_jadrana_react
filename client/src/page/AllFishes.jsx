import { useState, useEffect, createContext, useContext } from "react";
import SveRibe from "../components/SveRibe";
import FilterButtons from "../components/FilterButtons";
import Navigacija from "../components/Navigacija";
import { PaginationContext } from "../kontekst/PaginationContext";

function AllFishes({ backendData, endpointUrl, setUrl }) {
  const [sortedData, setSortedData] = useState([]);
  const [sortOptions, setSortOptions] = useState({
    field: "ime",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  /* ZA SORTIRANJE U FRONTENDU */
  useEffect(() => {
    if (!backendData || backendData.length === 0 || !sortOptions.field) {
      setSortedData(backendData);
      return;
    }

    const sorted = [...backendData].sort((a, b) => {
      const aVal = a[sortOptions.field];
      const bVal = b[sortOptions.field];

      if (typeof aVal === "string") {
        return sortOptions.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortOptions.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
    });
    setSortedData(sorted);
  }, [backendData, sortOptions]);
  /* ZA PRETRAŽIVANJE */
  useEffect(() => {
    if (!searchQuery) {
      setSortedData(backendData);
      return;
    } else {
      const searched = backendData.filter(
        (item) =>
          (item.ime &&
            item.ime.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.ostali_nazivi &&
            item.ostali_nazivi
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      setSortedData(searched);
    }
  }, [searchQuery, backendData]);

  return (
    <>
      <Navigacija />
      <PaginationContext.Provider value={{ currentPage, setCurrentPage }}>
        <FilterButtons
          endpointUrl={endpointUrl}
          setUrl={setUrl}
          setSortOptions={setSortOptions}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          setCurrentPage={setCurrentPage}
        />
        <SveRibe backEndData={sortedData} />
      </PaginationContext.Provider>
    </>
  );
}

export default AllFishes;
