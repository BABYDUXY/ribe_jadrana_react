import React, { useState, useEffect, useContext } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import ForumFilters from "../components/ForumFilters";
import { PaginationContext } from "../kontekst/PaginationContext";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import ListObjava from "../components/ListObjava";
import Pagination from "../components/Pagination";
import ListNovosti from "../components/listNovosti";

function Novosti() {
  const { endpointUrl } = useContext(EndpointUrlContext);

  const [sortOptions, setSortOptions] = useState({
    field: "ime",
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [clanci, setClanci] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Fallback ako PaginationContext nije dostupan
  let paginationContext = useContext(PaginationContext);
  const [localPage, setLocalPage] = useState(1);
  const currentPage = paginationContext?.currentPage || localPage;
  const setCurrentPage = paginationContext?.setCurrentPage || setLocalPage;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = clanci?.slice(startIndex, endIndex);
  const totalPages = Math.ceil((clanci?.length || 0) / itemsPerPage);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(3); // sm to < md
      } else if (width < 1280) {
        setItemsPerPage(3); // lg to < xl
      } else {
        setItemsPerPage(3); // xl+
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    console.log(itemsPerPage);
  }, [itemsPerPage]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${endpointUrl}/clanci`);
      const data = await response.json();

      // Sortiranje po najnovijima
      const sorted = data.sort((a, b) => new Date(b.datum) - new Date(a.datum));

      setClanci(sorted);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    console.log("Clanci:", paginatedData);
  }, [paginatedData]);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />

      <PaginationContext.Provider
        value={{ currentPage, setCurrentPage, itemsPerPage, setItemsPerPage }}
      >
        <ForumFilters
          setSortOptions={setSortOptions}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />

        <div className="flex flex-col items-center w-full gap-16 mb-24 -mt-20">
          <div
            draggable="false"
            className="flex flex-col items-center pointer-events-none select-none"
          >
            <div className="relative inline-block px-1 overflow-hidden">
              <h1 className="text-white glavno-naslov text-center text-[2rem] mb-1">
                Novosti
              </h1>
              <span className="absolute bottom-0  w-[180%] animated-element overflow-hidden rounded-full h-max">
                <img srcSet="logo/val.svg" className="w-full h-auto " />
              </span>
            </div>
            <h4 className="mt-2 italic text-white font-glavno">
              Najnovije novosti iz morskog svijeta jadrana.
            </h4>
          </div>
          {paginatedData.map((clanak) => (
            <ListNovosti
              key={`${clanak.ID}`}
              value={clanak}
              refreshPosts={fetchPosts}
            />
          ))}
        </div>
        <div className="-mt-10 mb-28">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </PaginationContext.Provider>

      <Footer />
    </div>
  );
}

export default Novosti;
