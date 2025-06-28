import React, { useState, useEffect, useContext } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import ForumFilters from "../components/ForumFilters";
import { PaginationContext } from "../kontekst/PaginationContext";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import ListObjava from "../components/ListObjava";
import Pagination from "../components/Pagination";
import { Navigate, useNavigate } from "react-router-dom";
import NaslovStranice from "../components/NaslovStranice";

function MojeObjave() {
  const { endpointUrl } = useContext(EndpointUrlContext);
  const user = sessionStorage.getItem("korisnik");
  const [sortOptions, setSortOptions] = useState({
    field: "ime",
    direction: "asc",
  });
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [javniUlovi, setJavniUlovi] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  let paginationContext = useContext(PaginationContext);
  const [localPage, setLocalPage] = useState(1);
  const currentPage = paginationContext?.currentPage || localPage;
  const setCurrentPage = paginationContext?.setCurrentPage || setLocalPage;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = javniUlovi?.slice(startIndex, endIndex);
  const totalPages = Math.ceil((javniUlovi?.length || 0) / itemsPerPage);

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
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${endpointUrl}/objave/mojeobjave`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();

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
  useEffect(() => {
    if (!user) {
      navigate("/prijava");
    }
  }, [user, navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />

      <PaginationContext.Provider value={{ currentPage, setCurrentPage }}>
        <ForumFilters
          setSortOptions={setSortOptions}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          javniUlovi={javniUlovi}
          setJavniUlovi={setJavniUlovi}
        />

        <div className="flex flex-col items-center w-full gap-16 mb-24 -mt-20">
          <NaslovStranice
            tekst="Moje Objave"
            opis="Sve tvoje javne objave na jednom mjestu."
          />
          {paginatedData.map((objava) => (
            <ListObjava
              key={objava.hash}
              value={objava}
              refreshPosts={fetchPosts}
              status={"public"}
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

export default MojeObjave;
