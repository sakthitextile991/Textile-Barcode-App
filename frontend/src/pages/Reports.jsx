import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

import ReportFilters from "../components/reports/ReportFilters";
import DashboardLayout from "./DashboardLayout";

function Reports() {

    const navigate = useNavigate();

    const [criteria, setCriteria] = useState("ST");

    const [reportType, setReportType] = useState("ALL");

    const [fabricType, setFabricType] = useState("");

    const [date, setDate] = useState({from: undefined,to: undefined});

    const [reportData, setReportData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [fabrics, setFabrics] = useState([]);

    const [fabricLoading, setFabricLoading] = useState(false);

    useEffect(() => {

        const fetchFabrics = async () => {

        try {

            setFabricLoading(true);

            const res = await api.get("fabrics/");

            setFabrics(res.data.results || res.data);

        } catch (err) {

            console.error(
            "Failed to fetch fabrics:",
            err
            );

            setError("Failed to load fabric types.");

        } finally {

            setFabricLoading(false);

        }

        };

        fetchFabrics();

    }, []);

     /*
        * When criteria changes:
        * ST -> show only ST fabrics
        * NF -> show only NF fabrics
    */

    const filteredFabrics = fabrics.filter(
        (fabric) =>
        fabric.type
            ?.toUpperCase()
            .startsWith(criteria)
    );

    /*
        * If criteria changes while a fabric
        * from the previous criteria is selected,
        * clear the selected fabric.
    */
    useEffect(() => {

        setFabricType("");

    }, [criteria]);

    const handleGenerate = async () => {

        setError("");
        setReportData(null);


        if (reportType === "SINGLE" && !fabricType) {

            setError("Please select a fabric type.");
            return;
        }

        if (!date?.from) {

            setError("Please select a date.");
            return;
        }

        if (date?.from && date?.to) {


            if (date.from > date.to) {

                setError("From date cannot be after To date.");
                return;
            }

        }


        try {

            setLoading(true);

            const params = {
                criteria: criteria,
                category: reportType.toLowerCase(),
            };


            if (reportType === "SINGLE") {
                params.fabric_id = fabricType;
            }


            if (date.from && date.to && date.from.getTime() !== date.to.getTime()) {

                params.from_date = formatDate(date.from);
                params.to_date = formatDate(date.to);

            } else {

                params.date = formatDate(date.from);

            }

            console.log("Report parameters:",params);



            const res = await api.get("reports/dispatch/",
                    {
                        params: params,
                    }
                );


            console.log("Report response:",res.data);

            setReportData(res.data);

            navigate(
                "/reports/result",
                {
                state: {
                    reportData: res.data,
                },
                }
            );

        } catch (err) {

            console.error("Report generation failed:",err);
            const backendError = err.response?.data?.error;
            setError(backendError || "Failed to generate report.");

        } finally {

            setLoading(false);

        }
    };

    
    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    return (

        <DashboardLayout>
            
            <div className="p-8">

                <h1 className="text-3xl font-bold text-slate-800 mb-8">
                    Reports
                </h1>

                <ReportFilters

                    criteria={criteria}
                    setCriteria={setCriteria}

                    reportType={reportType}
                    setReportType={setReportType}

                    fabricType={fabricType}
                    setFabricType={setFabricType}

                    fabrics={filteredFabrics}
                    fabricLoading={fabricLoading}

                    date={date}
                    setDate={setDate }

                    handleGenerate={handleGenerate}

                />

                {error && (

                    <div className="
                        mt-6
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        px-5
                        py-4
                        rounded-xl
                    ">
                        {error}
                    </div>

                )}


                {loading && (

                    <div className="
                        mt-8
                        text-center
                        text-slate-500
                    ">
                        Generating report...
                    </div>

                )}



            </div>

        </DashboardLayout>

    );

}

export default Reports;