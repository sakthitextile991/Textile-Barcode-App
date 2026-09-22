import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "../ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";


function ReportFilters({
  criteria,
  setCriteria,

  reportType,
  setReportType,

  fabricType,
  setFabricType,

  fabrics,
  fabricLoading,

  date,
  setDate,

  handleGenerate,
}) {

  return (

    <div className="bg-white rounded-2xl shadow border border-slate-200 p-8">
      
      <h2 className="text-2xl font-bold text-slate-800 mb-8">
        Report Filters
      </h2>

      {/* Top Filters */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Criteria */}
        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Criteria
          </label>

          <select
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600
              focus:border-blue-600
            "
          >

            <option value="ST">
              ST
            </option>

            <option value="NF">
              NF
            </option>

          </select>

        </div>

        {/* Report Type */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Report Type
          </label>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600
              focus:border-blue-600
            "
          >

            <option value="ALL">
              All
            </option>

            <option value="SINGLE">
              Single
            </option>

          </select>

        </div>

      </div>

      {/* Fabric */}

      <div className="mt-6">

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Fabric Type
        </label>

         <select
            value={fabricType}
            onChange={(e) =>
              setFabricType(e.target.value)
            }
            disabled={
              reportType === "ALL" ||
              fabricLoading
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600
              focus:border-blue-600
              disabled:bg-slate-100
              disabled:text-slate-400
              disabled:cursor-not-allowed
            "
          >

            <option value="">
              {fabricLoading
                ? "Loading fabrics..."
                : "Select Fabric Type"
              }
            </option>


            {fabrics.map((fabric) => (

              <option
                key={fabric.id}
                value={fabric.id}
              >
                {fabric.type}
              </option>

            ))}

          </select>

        {reportType === "ALL" && (

          <p className="text-xs text-slate-500 mt-2">
            Fabric selection is required only for Single reports.
          </p>

        )}

      </div>

      {/* Date Filter */}

      <div className="mt-8">

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Date
        </label>

        <Popover>

          <PopoverTrigger asChild>

            <button
              type="button"
              className="
                flex
                items-center
                gap-3
                w-full
                md:w-auto
                min-w-[300px]
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
                bg-white
                text-left
                hover:bg-slate-50
                focus:outline-none
                focus:ring-2
                focus:ring-blue-600
                transition
              "
            >

              <CalendarIcon
                size={18}
                className="text-slate-500"
              />

              {date?.from ? (

                date?.to ? (

                  <>
                    {format(
                      date.from,
                      "dd MMM yyyy"
                    )}

                    {" - "}

                    {format(
                      date.to,
                      "dd MMM yyyy"
                    )}
                  </>

                ) : (

                  format(
                    date.from,
                    "dd MMM yyyy"
                  )

                )

              ) : (

                <span className="text-slate-400">
                  Select Date
                </span>

              )}

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


        {/* Helpful description */}

        <p className="text-xs text-slate-500 mt-2">
          Select one date for a specific-day report,
          or select two dates for a date-range report.
        </p>

      </div>

      {/* Button */}

      <div className="flex justify-center mt-10">

        <button
          onClick={handleGenerate}
          className="
            bg-blue-700
            hover:bg-blue-800
            text-white
            font-semibold
            px-8
            py-3
            rounded-xl
            transition
            shadow-md
          "
        >

          Generate Report

        </button>

      </div>

    </div>
  );
}

export default ReportFilters;