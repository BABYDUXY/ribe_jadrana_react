import React, { useContext, useEffect, useState } from "react";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import { useNavigate } from "react-router-dom";

function RibaTable() {
  const [ribe, setRibe] = useState([]);
  const [filteredRibe, setFilteredRibe] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("ime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const { endpointUrl } = useContext(EndpointUrlContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${endpointUrl}/`)
      .then((res) => res.json())
      .then((data) => {
        setRibe(data);
        setFilteredRibe(data);
      })
      .catch((err) => console.error("Greška kod dohvata riba:", err));
  }, []);

  useEffect(() => {
    const filtered = ribe.filter((riba) =>
      riba.ime.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRibe(filtered);
    setCurrentPage(1);
  }, [search, ribe]);

  const handleSort = (field) => {
    const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...filteredRibe].sort((a, b) => {
      const valA = a[field] ?? "";
      const valB = b[field] ?? "";

      if (typeof valA === "string") {
        return order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return order === "asc" ? valA - valB : valB - valA;
    });

    setFilteredRibe(sorted);
  };

  const paginatedRibe = filteredRibe.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredRibe.length / rowsPerPage);

  return (
    <div className="p-4 text-white ">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Pretraži po imenu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 text-white border border-white  bg-moja_plava-tamna rounded-[11px] placeholder:text-white"
        />
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="overflow-x-auto outline outline-4 outline-white rounded-[18px]">
        <table className="min-w-full table-auto outline outline-4 outline-white rounded-[21px] p-4">
          <thead className="bg-moja_plava-tamna">
            <tr>
              {[
                "ID",
                "ime",
                "ostali_nazivi",
                "lat_ime",
                "vrsta",
                "dubina",
                "max_duljina",
                "max_tezina",
                "opis",
                "slika",
              ].map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`p-2 border  cursor-pointer hover:bg-moja_plava-tamna`}
                >
                  {field}{" "}
                  {sortField === field && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRibe.map((riba) => (
              <tr
                onClick={() => {
                  navigate(`/fish/${riba.ID}`);
                }}
                key={riba.ID}
                className={`hover:bg-moja_plava-tamna ${
                  riba.otrovna ? "text-red-200" : ""
                }`}
              >
                <td className="p-2 border border-white">{riba.ID}</td>
                <td className="p-2 border border-white">{riba.ime}</td>
                <td className="p-2 border border-white">
                  {riba.ostali_nazivi}
                </td>
                <td className="p-2 border border-white">{riba.lat_ime}</td>
                <td className="p-2 border border-white">{riba.vrsta}</td>
                <td className="w-auto p-2 border border-white text-nowrap">
                  {riba.min_dubina} - {riba.max_dubina} m
                </td>
                <td className="p-2 border border-white">
                  {riba.max_duljina} cm
                </td>
                <td className="p-2 border border-white">
                  {riba.max_tezina} kg
                </td>
                <td className="max-w-xs p-2 truncate border border-white">
                  {riba.opis}
                </td>
                <td className="p-2 border border-white">
                  {riba.slika ? (
                    <img
                      src={riba.slika}
                      alt={riba.ime}
                      className="w-auto h-12"
                    />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-2 rounded bg-moja_plava-tamna hover:bg-moja_plava-tamna"
        >
          Prethodna
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 rounded bg-moja_plava-tamna hover:bg-moja_plava-tamna"
        >
          Sljedeća
        </button>
      </div>
    </div>
  );
}

export default RibaTable;
