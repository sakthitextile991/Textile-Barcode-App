import { useLocation, useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";

import AllReportTable from "../components/reports/AllReportTable";
import SingleReportTable from "../components/reports/SingleReportTable";
import DashboardLayout from "./DashboardLayout";


function ReportResult() {

  const location = useLocation();
  const navigate = useNavigate();

  const reportData = location.state?.reportData;

  const handlePrint = () => {
    window.print();
  };

  /*
   * If user directly opens /reports/result
   * without generating a report
  */
  if (!reportData) {

    return (

      <DashboardLayout>

        <div className="
          min-h-[70vh]
          flex
          items-center
          justify-center
        ">

          <div className="text-center">

            <h2 className="
              text-2xl
              font-semibold
              text-slate-700
            ">
              No Reports Available
            </h2>

            <p className="
              text-lg
              text-slate-500
              mt-2
            ">
              Generate a report first.
            </p>

            <button
              onClick={() =>
                navigate("/reports")
              }
              className="
                mt-5
                bg-blue-700
                hover:bg-blue-800
                text-white
                px-5
                py-2
                rounded-lg
              "
            >
              Go to Reports
            </button>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  return (

    <DashboardLayout>
      <div className="
        p-4
        md:p-8
      ">

        {/* Top controls */}

        <div className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-8
          print:hidden
        ">

          <button
            onClick={() =>
              navigate("/reports")
            }
            className="
              text-blue-700
              font-medium
              hover:underline
            "
          >
            ← Back to Reports
          </button>


          <button
            onClick={handlePrint}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-blue-700
              hover:bg-blue-800
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
              shadow-sm
            "
          >
            <Printer size={18} />
            Print Report
          </button>

        </div>


        {/* Printable report */}

        <div
          id="printable-report"
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow
            p-6
            md:p-8
            print:border-0
            print:shadow-none
            print:p-0
          "
        >

          <h1 className="
              text-center 
              text-2xl
              md:text-3xl
              font-bold
              text-slate-900
            ">
              Dispatch Report
            </h1>

          {/* ALL report */}

          {reportData.category === "all" && (

            <AllReportTable reportData={reportData} />

          )}


          {/* SINGLE report */}

          {reportData.category === "single" && (

            <SingleReportTable reportData={reportData} />

          )}

        </div>

      </div>
      
    </DashboardLayout>

  );

}

export default ReportResult;