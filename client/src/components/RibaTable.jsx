import React, { useContext, useEffect, useState } from "react";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import { useNavigate } from "react-router-dom";

function RibaTable({
  tableConfig,
  endpoint = "/",
  secure = false,
  navigateUrlTemplate,
  searchField = "ime",
  searchPlaceholder = "Pretraži...",
  rowsPerPage = 10,
  highlightCondition,
  highlightClass = "text-red-200",
  setUrediId = null,
}) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(
    tableConfig.columns[0]?.field || ""
  );
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const { endpointUrl } = useContext(EndpointUrlContext);
  const navigate = useNavigate();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Add Authorization header if secure prop is true
    if (secure) {
      const token = sessionStorage.getItem("token");
      if (token) {
        requestOptions.headers["Authorization"] = `Token ${token}`;
      }
    }

    fetch(`${endpointUrl}${endpoint}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((err) => console.error(`Greška kod dohvata podataka:`, err));
  }, [endpointUrl, endpoint, secure]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item[searchField]?.toString().toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, data, searchField]);

  const handleSort = (field) => {
    const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[field] ?? "";
      const valB = b[field] ?? "";

      if (typeof valA === "string") {
        return order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return order === "asc" ? valA - valB : valB - valA;
    });

    setFilteredData(sorted);
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item);
    }

    if (column.type === "image") {
      return item[column.field] ? (
        <img
          src={`${item[column.field]}`}
          alt={column.alt ? item[column.alt] : ""}
          className={column.imageClass || "w-auto h-12"}
        />
      ) : (
        "-"
      );
    }

    if (column.type === "range") {
      return `${item[column.minField]} - ${item[column.maxField]} ${
        column.unit || ""
      }`;
    }

    if (column.type === "unit") {
      return `${item[column.field]} ${column.unit || ""}`;
    }

    if (column.type === "truncate") {
      return (
        <span className={column.truncateClass || "max-w-xs truncate"}>
          {item[column.field]}
        </span>
      );
    }

    return item[column.field];
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleRowClick = (item) => {
    if (setUrediId) {
      const itemId = item.ID || item.id;
      setUrediId(itemId);
    }

    if (navigateUrlTemplate && navigate) {
      const url = navigateUrlTemplate.replace("{id}", item.ID || item.id);
      navigate(url);
    }
  };

  return (
    <div className="p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 text-white border border-white bg-moja_plava-tamna rounded-[11px] placeholder:text-white"
        />
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="overflow-x-auto outline outline-4 outline-white rounded-[18px]">
        <table className="min-w-full table-auto outline outline-4 outline-white rounded-[21px] p-4">
          <thead className="bg-moja_plava-tamna">
            <tr>
              {tableConfig.columns.map((column) => (
                <th
                  key={column.field}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.field)
                  }
                  className={`p-2 border ${
                    column.sortable !== false
                      ? "cursor-pointer hover:bg-moja_plava-tamna"
                      : ""
                  }`}
                >
                  {column.label}{" "}
                  {sortField === column.field &&
                    column.sortable !== false &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.ID || item.id || index}
                onClick={() => handleRowClick(item)}
                className={`hover:bg-moja_plava-tamna   ${
                  navigateUrlTemplate || setUrediId ? "cursor-pointer" : ""
                } ${
                  highlightCondition && highlightCondition(item)
                    ? highlightClass
                    : ""
                }`}
              >
                {tableConfig.columns.map((column) => (
                  <td
                    key={column.field}
                    className={`p-2 border max-w-[5rem] overflow-hidden  border-white ${
                      column.cellClass || ""
                    }`}
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-2 rounded bg-moja_plava-tamna form-btn-hover hover:outline-2 hover:outline hover:outline-white"
        >
          Prethodna
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 rounded bg-moja_plava-tamna form-btn-hover hover:outline-2 hover:outline hover:outline-white"
        >
          Sljedeća
        </button>
      </div>
    </div>
  );
}

export default RibaTable;
