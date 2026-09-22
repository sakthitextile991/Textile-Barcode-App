import React from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SingleReportTable({ reportData }) {

  const navigate = useNavigate();

  if (
    !reportData ||
    reportData.category !== "single"
  ) {
    return null;
  }

  const results = reportData.results || [];

  const handleView = (dispatchId) => {
    navigate(`/dispatch/${dispatchId}`);
  };

  return (
    <div>

      {/* Report Header */}

      <div className="bg-white px-6">

        <div className="flex flex-col justify-center items-center">

          <p className="text-sm text-slate-500">
            Single Fabric Dispatch Report
          </p>

          <p className="text-center self-start text-sm text-slate-500 mt-5">
            Criteria:{" "}
            <span className="font-semibold text-slate-700">
              {reportData.criteria}
            </span>
          </p>

          <h2 className="text-center self-start text-2xl font-bold text-slate-800 mt-1">
            {reportData.fabric?.name}
          </h2>
    
        </div>

      </div>


      {/* Summary */}

      <div className="flex items-center gap-4 mt-6">

        <div className="w-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Dispatches
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-1">
            {reportData.count || 0}
          </p>

        </div>


        <div className="w-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Meters
          </p>

          <p className="text-2xl font-bold text-green-600 mt-1">
            {results.reduce(
              (sum, item) =>
                sum + Number(item.total_meters || 0),
              0
            )}
          </p>

        </div>


        <div className="w-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Rolls
          </p>

          <p className="text-2xl font-bold text-blue-700 mt-1">
            {results.reduce(
              (sum, item) =>
                sum + Number(item.total_rolls || 0),
              0
            )}
          </p>

        </div>

      </div>


      {/* Dispatch Table */}

      <div className="bg-white rounded-2xl shadow border border-slate-200 mt-6 overflow-hidden">

        <div className="p-6 border-b border-slate-200">

          <h3 className="text-xl font-bold text-slate-800">
            Dispatch Details
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Dispatches of <span className="text-black font-semibold">{reportData.fabric?.name}</span> during the selected period
          </p>

        </div>


        {results.length === 0 ? (

          <div className="
          bg-slate-50
          border
          border-dashed
          border-slate-300
          rounded-xl
          py-12
          text-center
        ">

          <p className="
            text-lg
            font-semibold
            text-slate-700
          ">
            No dispatches found
          </p>

          <p className="
            text-sm
            text-slate-500
            mt-1
          ">
            No fabric was dispatched during
            the selected period.
          </p>

        </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-blue-900 text-white text-xs uppercase">

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    DC Number
                  </th>

                  <th className="p-4 text-left">
                    Customer
                  </th>

                  <th className="p-4 text-right">
                    Total Meters
                  </th>

                  <th className="p-4 text-right">
                    Total Rolls
                  </th>

                  <th className="p-4 text-center">
                    View
                  </th>

                </tr>

              </thead>


              <tbody>

                {results.map((item, index) => (

                  <tr
                    key={item.id}
                    className={`
                      border-b
                      border-slate-100
                      hover:bg-slate-50
                      transition
                      ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/50"
                      }
                    `}
                  >

                    {/* Date */}

                    <td className="p-4 text-slate-700">

                      {new Date(
                        item.date
                      ).toLocaleDateString("en-GB")}

                    </td>


                    {/* DC Number */}

                    <td className="p-4">

                      <span className="font-semibold text-blue-700">
                        {item.dispatch_no}
                      </span>

                    </td>


                    {/* Customer */}

                    <td className="p-4 text-slate-700">

                      {item.customer_name}

                    </td>


                    {/* Meters */}

                    <td className="p-4 text-right">

                      <span className="font-semibold text-green-600">
                        {item.total_meters}
                      </span>

                    </td>


                    {/* Rolls */}

                    <td className="p-4 text-right">

                      <span className="font-semibold text-slate-700">
                        {item.total_rolls}
                      </span>

                    </td>


                    {/* View */}

                    <td className="p-4 text-center">

                      <button
                        onClick={() =>
                          handleView(item.id)
                        }
                        title="View Dispatch"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          w-9
                          h-9
                          rounded-lg
                          text-blue-700
                          hover:bg-blue-100
                          transition
                        "
                      >

                        <Eye size={18} />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default SingleReportTable;