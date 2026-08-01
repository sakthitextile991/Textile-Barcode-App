import { Printer, Trash2, ChevronLeft, ChevronRight, Pencil, Search} from "lucide-react";
import { useEffect, useState } from "react";
import DeleteBarcodeDialog from "./DeleteBarcodeDialog";
import api from "../../services/api";

const BarcodeTable = ({
  onPrint,
  onDelete,
  onEdit,
}) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const filteredData = data.filter((item) =>
    String(item.roll_no || "")
      .toLowerCase()
      .startsWith(search.toLowerCase())
  );

  //Pagination
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role?.toLowerCase() === "admin";


  {/*Visible page slider*/}
  const MAX_VISIBLE_PAGES = 4;

  const currentGroup = Math.floor(
    (currentPage - 1) / MAX_VISIBLE_PAGES
  );
  const startPage =
    currentGroup * MAX_VISIBLE_PAGES + 1;
  const endPage = Math.min(
    startPage + MAX_VISIBLE_PAGES - 1,
    totalPages
  );
  const visiblePages = [];

  for (
    let page = startPage;
    page <= endPage;
    page++
  ) {
    visiblePages.push(page);
  }

  {/*Next buttonn click in page slider*/}
  const goNextGroup = () => {
  const nextPage = startPage + MAX_VISIBLE_PAGES;

    if (nextPage <= totalPages) {
      setCurrentPage(nextPage);
    }
  };

  const goPrevGroup = () => {
    const prevPage = startPage - MAX_VISIBLE_PAGES;

    if (prevPage >= 1) {
      setCurrentPage(prevPage);
    }
  };


  const deleteBarcode = async (id) => {

  try {

    await api.delete(`barcode/${id}/`);

    setData(prev =>
      prev.filter(item => item.id !== id)
    );

    setDeleteOpen(false);
    setSelectedBarcode(null);

  } catch (err) {

    alert("Deletion failed");

  }

};

  {/*API to get the barcodes to display below */ }
  useEffect(() => {

    const fetchBarcodes = async () => {

      try {

        const res = await api.get(
          "barcode/list_barcode"
        );

        setData(res.data);

      } catch (err) {

        console.error(
          "Failed to load fabrics",
          err
        );

      }

    };

    fetchBarcodes();

  }, []);

  {/*Suppose you're on page 14 and delete the last item.
    After deletion: total pages will decrease but current page will still be 14 This will avoid it */}
  useEffect(() => {

    const pages = Math.ceil(
      filteredData.length / ITEMS_PER_PAGE
    );

    if (
      currentPage > pages &&
      pages > 0
    ) {
      setCurrentPage(pages);
    }

  }, [data]);



  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        Generated Barcodes
      </h2>

      <div className="mb-6 relative max-w-md">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => {
      
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by roll number..."
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            py-3
            pl-11
            pr-4
            outline-none
            transition
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full">

          <thead>

            <tr className="text-[15px] bg-blue-900 text-white uppercase">

              <th className="p-4 text-left font-semibold">
                Barcode
              </th>

              <th className="p-4 text-left font-semibold">
                Fabric
              </th>

              <th className="p-4 text-left font-semibold">
                Meters
              </th>

              <th className="p-4 text-left font-semibold">
                Weight
              </th>

              <th className="p-4 text-center font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredData.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="
                    text-center
                    py-10
                    text-slate-500
                  "
                >
                  {search
                    ? "No barcode found for this roll number"
                    : "No barcodes generated yet"
                  }
                </td>

              </tr>

            ) : (

              currentItems.map(item => (

                <tr
                  key={item.id}
                  className="border-b hover: bg-slate-50"
                >

                  <td className="p-4">
                    {item.barcode}
                  </td>

                  <td className="p-4">
                    {item.fabric_name}
                  </td>

                  <td className="p-4">
                    {item.meters}
                  </td>

                  <td className="p-4">
                    {item.weight}
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-4">

                      <button
                        onClick={() => onPrint(item)}
                      >
                        <Printer
                          size={18}
                          className="text-blue-700"
                        />
                      </button>
                      
                      { isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(item)}
                            title="Edit"
                          >
                            <Pencil
                              size={18}
                              className="text-green-600"
                            />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedBarcode(item);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2
                              size={18}
                              className="text-red-600"
                            />
                          </button>
                        </>
                      )}

                    </div>

                  </td>

                </tr>

              ))

            )}

            <DeleteBarcodeDialog
                open={deleteOpen}
                barcode={selectedBarcode}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedBarcode(null);
                }}
                onConfirm={deleteBarcode}
            />

          </tbody>

        </table>

      </div>

      {filteredData.length > 0 && (

        <div className="flex items-center justify-between mt-6">
          <p className="text-slate-600">
            showing{" "}

            {startIndex + 1}

            {" "}to{" "}

            {Math.min(endIndex, filteredData.length)}

            {" "}of{" "}

            {filteredData.length}

            {" "} items
          </p>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={goPrevGroup}
              disabled={startPage === 1}
              className="
                w-10 h-10 
                border rounded-lg 
                flex items-center 
                justify-center 
                disabled:opacity-40
              "
            >
              <ChevronLeft size={18} />
            </button>

            {visiblePages.map((page) => (

              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  currentPage === page
                    ? "bg-blue-700 text-white"
                    : "border text-slate-700"
                }`}
              >
                {page}
              </button>

            ))}

            <button
              onClick={goNextGroup}
              disabled={endPage === totalPages}
              className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default BarcodeTable;