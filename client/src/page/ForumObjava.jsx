import React, { useState, useEffect, useContext, useMemo } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import ForumFilters from "../components/ForumFilters";
import { PaginationContext } from "../kontekst/PaginationContext";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import ListObjava from "../components/ListObjava";
import Pagination from "../components/Pagination";
import NaslovStranice from "../components/NaslovStranice";
function ForumObjava() {
  const { endpointUrl } = useContext(EndpointUrlContext);

  const [sortOptions, setSortOptions] = useState({
    field: "ime",
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [javniUlovi, setJavniUlovi] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const publicUlovi = useMemo(() => {
    return javniUlovi.filter((ulov) => ulov.status === "public");
  }, [javniUlovi]);

  // Fallback ako PaginationContext nije dostupan
  let paginationContext = useContext(PaginationContext);
  const [localPage, setLocalPage] = useState(1);
  const currentPage = paginationContext?.currentPage || localPage;
  const setCurrentPage = paginationContext?.setCurrentPage || setLocalPage;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = publicUlovi.slice(startIndex, endIndex);
  const totalPages = Math.ceil(publicUlovi.length / itemsPerPage);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(20); // sm to < md
      } else if (width < 1280) {
        setItemsPerPage(6); // lg to < xl
      } else {
        setItemsPerPage(6); // xl+
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${endpointUrl}/objave/ulovi`);
      const data = await response.json();

      // Sortiranje po najnovijima
      const sorted = data.sort(
        (a, b) => new Date(b.datum_kreiranja) - new Date(a.datum_kreiranja)
      );

      setJavniUlovi(sorted);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (javniUlovi.length > 0 && sortOptions && sortOptions != "") {
      const sorted = [...javniUlovi].sort((a, b) => {
        const fieldA = a[sortOptions.field];
        const fieldB = b[sortOptions.field];

        if (
          sortOptions.field === "datum_kreiranja" ||
          sortOptions.field.includes("datum")
        ) {
          const dateA = new Date(fieldA);
          const dateB = new Date(fieldB);

          if (sortOptions.ascending) {
            return dateA - dateB;
          } else {
            return dateB - dateA;
          }
        }

        // Za stringove
        if (typeof fieldA === "string" && typeof fieldB === "string") {
          if (sortOptions.ascending) {
            return fieldA.localeCompare(fieldB);
          } else {
            return fieldB.localeCompare(fieldA);
          }
        }

        if (sortOptions.field === "popularnost") {
          const popularnostA = (a.broj_lajkova || 0) - (a.broj_dislajkova || 0);
          const popularnostB = (b.broj_lajkova || 0) - (b.broj_dislajkova || 0);

          if (sortOptions.ascending) {
            return popularnostA - popularnostB;
          } else {
            return popularnostB - popularnostA;
          }
        }

        // Za brojeve
        if (sortOptions.ascending) {
          return fieldA - fieldB;
        } else {
          return fieldB - fieldA;
        }
      });

      setJavniUlovi(sorted);
    }
  }, [sortOptions]);

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
          javniUlovi={javniUlovi}
          setJavniUlovi={setJavniUlovi}
        />

        <div className="flex flex-col items-center w-full gap-16 mb-24 -mt-20">
          <NaslovStranice
            tekst="Ulovi"
            opis="Svačije uspomene na jednom mjestu. "
          />

          {paginatedData.map((objava) => (
            <ListObjava
              key={`${objava.hash}-${objava.komentari.length}`}
              value={objava}
              refreshPosts={fetchPosts}
              status="public"
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

export default ForumObjava;
