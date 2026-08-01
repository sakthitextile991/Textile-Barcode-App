import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  X,
} from "lucide-react";

const StockTable = () => {

  const navigate = useNavigate();

  const [data,setData] = useState([]);
  const [search, setSearch] = useState("");

  // Check admin
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.role?.toUpperCase() === "ADMIN";

  // Edit modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [fabricName, setFabricName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchFabrics = async () => {

    try {
      const response = await api.get("fabrics/");
      setData(response.data);

    } catch (err) {

      console.error(
        "Unable to fetch fabrics:",
        err
      );
    }
  };

  useEffect(() => {
    fetchFabrics();
  }, []);



  const filteredData = data.filter((fabric) =>
    fabric.type
      .toLowerCase()
      .startsWith(search.toLowerCase())
  );

  {/*Number of records in one page */}
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, endIndex);

  {/*Visible page slider*/}
  const MAX_VISIBLE_PAGES = 3;

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


  // Open edit modal
  const handleEditClick = (fabric) => {

    setSelectedFabric(fabric);
    setFabricName(fabric.type);
    setError("");
    setIsEditOpen(true);
  };


  // Close edit modal
  const closeEditModal = () => {

    setIsEditOpen(false);
    setSelectedFabric(null);
    setFabricName("");
    setError("");
  };


  // Update fabric name
  const handleUpdateFabric = async (event) => {

    event.preventDefault();
    if (!fabricName.trim()) {
      setError(
        "Fabric name cannot be empty."
      );
      return;
    }

    try {

      setIsSaving(true);
      setError("");
      await api.patch(`fabrics/${selectedFabric.id}/`,
        {
          type:fabricName.trim()
        }
      );

      // Reload table data
      await fetchFabrics();
      closeEditModal();

    } catch (err) {

      console.error(
        "Fabric update failed:",
        err
      );

      setError(

        err.response?.data?.type?.[0]
        ||
        err.response?.data?.detail
        ||
        "Unable to update fabric."
      );

    } finally {

      setIsSaving(false);

    }

  };

  return (
    <>
      <div
        className="
          bg-white
          rounded-2xl
          p-6
          shadow-sm
          border
          border-slate-100
        "
      >
        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="mb-6 relative">
            <Search
              size={18}
              className="
                absolute
                left-4
                top-4
                text-slate-400
              "
            />
            <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
              placeholder="Search fabric..."
              className="
                border
                rounded-xl
                pl-12
                py-3
                w-full
                lg:w-[450px]
              "
            />
          </div>

        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-xl">

          <table className="w-full border">

            <thead>

              <tr
                className="
                  bg-blue-900
                  text-white
                  text-[15px]
                  uppercase
                  
                "
              >
                <th className="p-4 text-left font-semibold">
                  Fabric Name
                </th>

                <th className="p-4 text-left font-semibold">
                  Meters
                </th>

                <th className="p-4 text-left font-semibold">
                  No of Rolls
                </th>

                <th className="p-4 text-center font-semibold">
                  Action
                </th>
              </tr>

            </thead>

            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="
                      text-center
                      py-10
                      text-slate-500
                    "
                  >
                    No Fabric generated yet
                  </td>

                </tr>

              ) : (currentItems.map(item => (

                  <tr
                    key={item.id}
                    className="border-b"
                  >
                    <td className="p-4">
                      {item.type}
                    </td>

                    <td className="p-4">
                      {item.stock}
                    </td>

                    <td className="px-10 p-4">
                      {item.total_rolls}
                    </td>

                    <td className="p-4 text-center">

                      <div className="flex items-center justify-center gap-3">

                        {/* Edit */}
                        
                        {isAdmin && (
                          <button
                            onClick={() => handleEditClick(item)}
                            title="Edit fabric name"
                            className="
                              flex items-center
                              border border-slate-200
                              text-slate-700 text-[14px] font-semibold
                              px-3 py-2 gap-2
                              rounded-lg shadow-md
                              bg-slate-20
                              hover:bg-slate-200
                              transition
                            "

                          >
                            <Pencil size={14} className="text-green-600" />
                            Edit

                          </button>
                        )}

                        {/* View */}
                        <button
                          onClick={() => navigate(`/fabric-rolls/${item.id}`)}
                          title="View fabric rolls"
                          className="
                            flex
                            items-center
                            gap-1
                            bg-blue-600
                            text-white
                            text-[14px]
                            font-semibold
                            px-3
                            py-2
                            rounded-lg
                            hover:bg-blue-700
                            transition
                          "
                        >
                          <Eye size={14} />
                          View

                        </button>

                      </div>

                    </td>
                  </tr>

                ))
              )}

            </tbody>

          </table>

          {/*Pagination */}
          {data.length > 0 && (

            <div className="flex items-center justify-between mt-6 px-5 pb-3">
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
                    className={`w-10 h-10 rounded-lg font-medium ${currentPage === page
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

      </div>

      {/* Edit Fabric Modal */}

        {
          isEditOpen
          &&
          (
            <div
              className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-slate-950/50
                px-4
              "
            >

              <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                {/* Modal header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                  
                  <div>
                    <h2 className="text-xl font-bold text-blue-950">
                      Edit Fabric
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Update the fabric name.
                    </p>

                  </div>

                  <button
                    onClick={closeEditModal}
                    className="
                      rounded-lg
                      p-2
                      text-slate-500
                      hover:bg-slate-100
                    "
                  >
                    <X size={20} />

                  </button>

                </div>

                {/* Modal form */}

                <form
                  onSubmit={handleUpdateFabric}
                  className="p-6"
                >

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Fabric Name
                  </label>

                  <input

                    value={fabricName}
                    onChange={(event) => setFabricName(event.target.value)}
                    placeholder="Enter fabric name"
                    autoFocus
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      px-4
                      py-3
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                  {
                    error
                    &&
                    (
                      <p className="mt-3 text-sm text-red-600">
                        {error}
                      </p>
                    )
                  }

                  {/* Buttons */}

                  <div className="mt-7 flex justify-end gap-3">

                    <button

                      type="button"
                      onClick={closeEditModal}
                      disabled={isSaving}
                      className="
                        rounded-xl
                        border
                        border-slate-300
                        px-5
                        py-2.5
                        text-slate-700
                        hover:bg-slate-50
                      "
                    >
                      Cancel
                    </button>


                    <button

                      type="submit"
                      disabled={isSaving}
                      className="
                        rounded-xl
                        bg-blue-700
                        px-5
                        py-2.5
                        font-medium
                        text-white
                        hover:bg-blue-800
                        disabled:opacity-60
                      "
                    >

                      {
                        isSaving
                        ?
                        "Saving..."
                        :
                        "Save Changes"
                      }

                    </button>
                  </div>
                </form>

              </div>

            </div>

          )
        }
    </>

  );
}

export default StockTable;