import React, { useState, useEffect } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import ForumFilters from "../components/ForumFilters";
import { PaginationContext } from "../kontekst/PaginationContext";
import { useContext } from "react";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import ListObjava from "../components/ListObjava";

function ForumObjava() {
  const { endpointUrl } = useContext(EndpointUrlContext);
  const [sortOptions, setSortOptions] = useState({
    field: "ime",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [javniUlovi, setJavniUlovi] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${endpointUrl}/objave/ulovi`);
        const data = await response.json();
        setJavniUlovi(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <PaginationContext.Provider value={{ currentPage, setCurrentPage }}>
        <ForumFilters
          setSortOptions={setSortOptions}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
        <div className="flex flex-col items-center w-full gap-16 mb-24">
          {javniUlovi.map((objava) => (
            <ListObjava key={objava.hash} value={objava} />
          ))}
        </div>
      </PaginationContext.Provider>
      <Footer />
    </div>
  );
}

export default ForumObjava;
