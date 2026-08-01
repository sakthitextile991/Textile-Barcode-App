import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import api from "../services/api";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

function Dispatch() {
  const navigate = useNavigate();

  const [dispatches, setDispatches] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);


  {/**Default date when entering the Dispatch list*/}
  const today = new Date();

  const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
  );

  const [date, setDate] = useState({
      from: firstDay,
      to: today,
  });


  {/*USed to obtain the available financial months for filtering in the Dispatch list */}
  useEffect(() => {

    if (!date?.from || !date?.to)
        return;

    const fetchDispatches = async () => {

      try {

        const from = format(date.from, "yyyy-MM-dd");

        const to = format(date.to, "yyyy-MM-dd");

        const res = await api.get(

          `dispatch/by_date/?from=${from}&to=${to}&page=${currentPage}`

        );

        setDispatches(
            res.data.results
        );

        setTotalPages(

            Math.ceil(
                res.data.count / 10
            )

        );

      }

      catch (err) {

        console.log(err);

      }

    };

    fetchDispatches();

  }, [date, currentPage]);


  return (
    <DashboardLayout>
      <div className="bg-slate-100 min-h-screen p-6">

        <div className="bg-white rounded-3xl shadow-md p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">

            <h1 className="text-3xl font-bold text-slate-900">
              Dispatch List
            </h1>

          </div>

          {/* Date Filter */}
          <div className="flex justify-between mb-8">

            <Popover>

              <PopoverTrigger asChild>

                <button
                  className="
                    flex
                    items-center
                    gap-3
                    border
                    rounded-xl
                    px-4
                    py-3
                    bg-white
                  "
                >

                  <CalendarIcon size={18} />

                  {
                    date?.from ? date.to ? /*If there is from and to */
                        <>
                          {

                            format( date.from, "dd MMM yyyy" )
                          }

                          {" - "}

                          {

                            format( date.to, "dd MMM yyyy" )
                          }

                        </>

                          :   /*Else only single date */

                          format( date.from, "dd MMM yyyy")
                        :

                        "Select Date"

                  }

                </button>

              </PopoverTrigger>

                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                >

                  <Calendar

                    mode="range"

                    selected={date}

                    onSelect={setDate}

                    numberOfMonths={2}

                  />

                </PopoverContent>

            </Popover>
            
            <button
              onClick={() => navigate("/dispatch-list")}
              className="
                bg-blue-700
                text-white
                px-6
                py-3
                rounded-xl
                hover:bg-blue-800
                transition
              "
            >
              + Create Dispatch
            </button>


          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">

            <table className="w-full">

              <thead>

                <tr className="bg-blue-900 text-white text-xs uppercase">

                  <th className="p-4 text-left font-semibold">
                    Dispatch No
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Customer Name
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Fabric
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Total Meters
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Vehicle No
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Date
                  </th>

                  <th className="p-4 text-center font-semibold">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {dispatches.map((dispatch) => (

                  <tr
                    key={dispatch.dispatchNo}
                    className="
                      border-b
                      last:border-b-0
                      hover:bg-slate-50
                    "
                  >

                    <td className="p-4">
                      {dispatch.dispatch_no}
                    </td>

                    <td className="p-4">
                      {dispatch.customer_name}
                    </td>

                    <td className="p-4">
                      {dispatch.fabric_name}
                    </td>

                    <td className="p-4">
                      {dispatch.total_meters}
                    </td>

                    <td className="p-4">
                      {dispatch.vehicle_no}
                    </td>

                    <td className="p-4">
                      {new Date(
                        dispatch.dispatched_at
                      ).toLocaleDateString("en-GB")}
                    </td>

                    <td className="p-4 text-center">

                      <button
                      onClick={() =>
                        navigate(
                          `/dispatch/${dispatch.id}`
                        )
                      }
                        className="
                          bg-blue-700
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          hover:bg-blue-800
                          transition
                        "
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8 ">

            <button
              disabled={currentPage === 1}
              className="px-3 py-1 border border-2 border-sky-500 rounded-lg shadow-lg flex items-center justify-center disabled:opacity-40"
              onClick={() =>
                setCurrentPage(
                  prev => prev - 1
                )
              }
            >
              Prev
            </button>

            <span className="">
              Page {currentPage} of {totalPages}
            </span>

            <button
            className="px-3 py-1 border border-2 border-sky-500 rounded-lg shadow-lg flex items-center justify-center disabled:opacity-40"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  prev => prev + 1
                )
              }
            >
              Next
            </button>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Dispatch;