import React from "react";

function AllReportTable({ reportData }) {

  if (
    !reportData ||
    reportData.category !== "all"
  ) {
    return null;
  }


  const results =
    reportData.results || [];


  /*
   * Calculate grand totals
   */

  const totalRolls = results.reduce(
    (sum, item) =>
      sum + Number(item.total_rolls || 0),
    0
  );


  const totalMeters = results.reduce(
    (sum, item) =>
      sum + Number(item.total_meters || 0),
    0
  );


  const totalWeight = results.reduce(
    (sum, item) =>
      sum + Number(item.total_weight || 0),
    0
  );


  return (

    <div>

      {/* Report heading */}

      <div className="bg-white px-6">

        <div className="flex flex-col justify-center items-center">

          <p className="text-sm text-slate-500">
            All Fabric Dispatch Report
          </p>

          <p className="text-center self-start text-sm text-slate-500 mt-5">
            Criteria:{" "}
            <span className="font-semibold text-slate-700">
              {reportData.criteria}
            </span>
          </p>

          <h2 className="text-center self-start text-2xl font-bold text-slate-800 mt-1">
            All fabric report
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


      {/* No results */}

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

        <div className="bg-white rounded-2xl shadow border border-slate-200 mt-6 overflow-hidden">

          <div className="p-6 border-b border-slate-200">

            <h3 className="text-xl font-bold text-slate-800">
              Dispatch Details
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Dispatches of <span className="text-black font-semibold">{reportData.criteria}</span> during the selected period
            </p>

          </div>

          <table className="
            w-full
            border-collapse
          ">

            <thead>

              <tr className="
                bg-blue-900
                text-white
                text-sm
              ">

                <th className="px-5 py-4 text-left">
                  Fabric
                </th>

                <th className="px-5 py-4 text-center">
                  Total Rolls
                </th>

                <th className="px-5 py-4 text-center">
                  Total Meters
                </th>

                <th className="px-5 py-4 text-center">
                  Total Weight
                </th>

                <th className="px-5 py-4 text-center">
                  Dispatches
                </th>

              </tr>

            </thead>


            <tbody>

              {results.map((item) => (

                <tr
                  key={item.fabric_id}
                  className="
                    border-b
                    border-slate-100
                    hover:bg-slate-50
                  "
                >

                  <td className="
                    px-5
                    py-4
                    font-semibold
                    text-slate-800
                  ">
                    {item.fabric_name}
                  </td>


                  <td className="
                    px-5
                    py-4
                    text-center
                  ">
                    {item.total_rolls}
                  </td>


                  <td className="
                    px-5
                    py-4
                    text-center
                  ">
                    {item.total_meters}
                  </td>


                  <td className="
                    px-5
                    py-4
                    text-center
                  ">
                    {Number(
                      item.total_weight
                    ).toFixed(2)}
                  </td>


                  <td className="
                    px-5
                    py-4
                    text-center
                  ">
                    {item.dispatch_count}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default AllReportTable;