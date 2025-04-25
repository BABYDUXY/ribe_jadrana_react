import { useContext, useEffect, useState } from "react";
import ListItem from "./ListItem";
import { PaginationContext } from "../kontekst/PaginationContext";
import Pagination from "./Pagination"; // Import the new component

function SveRibe({ backEndData }) {
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const { currentPage, setCurrentPage } = useContext(PaginationContext);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = backEndData?.slice(startIndex, endIndex);

  const totalPages = Math.ceil((backEndData?.length || 0) / itemsPerPage);
  //za prikaz drugog broja riba po stranici ovisno o ekranu
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setItemsPerPage(6); // sm to < md
      } else if (width < 1280) {
        setItemsPerPage(12); // lg to < xl
      } else {
        setItemsPerPage(16); // 2xl+
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 m-auto mb-20 w-max md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!Array.isArray(backEndData) || backEndData.length === 0 ? (
          <div className="h-[20rem]  w-[30rem] col-span-4 place-self-center glavno-nav text-white flex flex-col items-center justify-center">
            <div className="relative inline-block">
              <p className="text-4xl">Nema Sadržaja</p>
              <span className="absolute left-0 bottom-0 w-full h-[3px] rounded-full overflow-hidden">
                <span className="block w-1/3 h-full bg-white rounded-full animate-underlinePingPong" />
              </span>
            </div>
          </div>
        ) : (
          paginatedData.map((riba) => <ListItem key={riba.ID} value={riba} />)
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </>
  );
}

export default SveRibe;
