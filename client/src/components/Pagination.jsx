import React, { useContext } from "react";

function Pagination({ currentPage, setCurrentPage, totalPages }) {
  return (
    totalPages > 1 && (
      <div className="flex justify-center col-span-1 gap-2 text-lg text-white md:col-span-2 lg:col-span-3 xl:col-span-4 font-glavno">
        <img
          src="/logo/arrow.svg"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className={`transition-all duration-200 w-[20px] rotate-90 ${
            currentPage === 1
              ? "opacity-50"
              : "hover:cursor-pointer hover:scale-105 hover:-translate-x-1"
          }`}
          disabled={currentPage === 1}
          alt="Prethodna stranica"
        />

        <span className="px-3 py-1">
          {currentPage} / {totalPages}
        </span>

        <img
          src="/logo/arrow.svg"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className={`transition-all duration-200 w-[20px] -rotate-90 ${
            currentPage === totalPages
              ? "opacity-50"
              : "hover:cursor-pointer hover:scale-105 hover:translate-x-1"
          }`}
          disabled={currentPage === totalPages}
          alt="Sljedeća stranica"
        />
      </div>
    )
  );
}

export default Pagination;
