import React, { useState, useEffect, useContext, useMemo } from "react";
import { PaginationContext } from "../kontekst/PaginationContext";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import ListObjava from "../components/ListObjava";
import Pagination from "../components/Pagination";
import ObrazacUlov from "../components/ObrazacUlov";
function AdminObjave() {
  const { endpointUrl } = useContext(EndpointUrlContext);
  const token = sessionStorage.getItem("token");
  const [uredi, setUredi] = useState(null);

  const [sortOptions, setSortOptions] = useState({
    field: "ime",
    direction: "asc",
  });
  const [ribaId, setRibaId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [javniUlovi, setJavniUlovi] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const publicUlovi = useMemo(() => {
    return javniUlovi.filter((ulov) => ulov.status === "pending");
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
        setItemsPerPage(1); // sm to < md
      } else if (width < 1280) {
        setItemsPerPage(1); // lg to < xl
      } else {
        setItemsPerPage(2); // xl+
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
    console.log("ULOVI UPDATE:", paginatedData);
  }, [paginatedData]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleStatusChange = async (hash, newStatus) => {
    try {
      const response = await fetch(`${endpointUrl}/objave/ulovi/${hash}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchPosts();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSubmitUlov = async (e, hash) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    if (ribaId) {
      formData.append("riba", ribaId);
    }

    console.log("PODACI SU:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${endpointUrl}/api/objava/javno/${hash}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Uspješno ažurirano:", result);
        alert("Ulov je uspješno ažuriran.");
        setUredi(null);
        fetchPosts();
      } else {
        console.error("Greška:", result.poruka);
        alert("Greška: " + result.poruka);
      }
    } catch (err) {
      console.error("Mrežna greška:", err);
      alert("Dogodila se mrežna greška.");
    }
  };

  return (
    <PaginationContext.Provider value={{ currentPage, setCurrentPage }}>
      <div className="flex flex-col items-center w-full gap-16 mt-24 mb-24">
        {uredi ? (
          <form onSubmit={(e) => handleSubmitUlov(e, uredi.hash)}>
            <ObrazacUlov
              privatnost={"javno"}
              setRibaId={setRibaId}
              setCompressedImage={""}
              promptValues={uredi}
            />
            <div className="flex justify-center w-full gap-8 -mt-6">
              <button
                className="w-[20%] text-white glavno-nav form-btn-hover hover:w-[23%] bg-moja_plava-tamna p-[0.3rem_0rem] mt-2 self-center rounded-[7px] outline outline-white outline-[3px]"
                type="submit"
              >
                Objavi
              </button>
              <button
                onClick={() => setUredi(null)}
                className="w-[20%] text-white glavno-nav form-btn-hover hover:w-[23%] bg-moja_plava-tamna p-[0.3rem_0rem] mt-2 self-center rounded-[7px] outline outline-white outline-[3px]"
              >
                Odustani
              </button>
            </div>
          </form>
        ) : (
          paginatedData.map((objava) => (
            <div className="flex">
              <ListObjava
                key={`${objava.hash}`}
                value={objava}
                refreshPosts={fetchPosts}
                status="pending"
              />
              <div className="flex flex-col justify-center gap-8 ml-4 [&>img:hover]:scale-105 [&>img]:cursor-pointer">
                <img
                  className="h-7"
                  src="/logo/kvacica.svg"
                  alt=""
                  onClick={() => handleStatusChange(objava.hash, "public")}
                />
                <img
                  className="h-7"
                  src="/logo/x.svg"
                  alt=""
                  onClick={() => handleStatusChange(objava.hash, "hidden")}
                />
                <img
                  onClick={() => setUredi(objava)}
                  className="h-7"
                  src="/logo/pencil.svg"
                  alt=""
                />
              </div>
            </div>
          ))
        )}
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
  );
}

export default AdminObjave;
