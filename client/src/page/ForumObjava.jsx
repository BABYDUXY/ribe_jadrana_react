import React, { useState } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import ForumFilters from "../components/ForumFilters";
import { PaginationContext } from "../kontekst/PaginationContext";

function ForumObjava() {
  const [sortOptions, setSortOptions] = useState({
    field: "ime",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <PaginationContext.Provider value={{ currentPage, setCurrentPage }}>
        <ForumFilters setSortOptions={setSortOptions} />
      </PaginationContext.Provider>
      <Footer />
    </div>
  );
}

export default ForumObjava;
