import { useState, useEffect } from "react";
import api from "../../services/api";


const DispatchCard = () => {

  const [dispatches, setDispatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api
      .get("dispatch/recent_dispatch/")
      .then((res) => {
        setDispatches(res.data);
      });
  }, []);

  if (dispatches.length === 0) {
    return (
      <>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-slate-800">
            Recent Dispatch
          </h2>

          <span className="text-sm text-slate-500">
            Auto Updated
          </span>
        </div>

        <div className="
          h-[280px]
          flex
          items-center
          justify-center
          rounded-xl
          border
          border-dashed
          border-slate-300
          bg-slate-50
        ">
          <div className="text-center">
            <p className="text-5xl mb-3">📦</p>

            <p className="text-lg font-semibold text-slate-700">
              No Recent Dispatches Yet
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Dispatches will appear here once created
            </p>
          </div>
        </div>
      </>
    );
  }

  const current = dispatches[currentIndex];


  const getInitials = (name) => {
    if (!name) return "?";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }

    return words
      .map((word) => word[0])
      .join("")
      .substring(0, 3)
      .toUpperCase();
  };

  const customerInitials = getInitials(
    current?.customer_name
  );

    return (

      <>
        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold text-slate-800">
            Recent Dispatch
          </h2>

          <span className="text-sm text-slate-500">
            Auto Updated
          </span>

        </div>

        <div className="relative overflow-hidden min-h-[280px]">

          <div className="flex flex-col lg:flex-row items-center gap-6">

            {/* Details */}

            <div className="w-full flex-1 space-y-4">

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  Date
                </span>

                <span className="font-semibold">
                  {new Date(
                        current?.dispatched_at
                      ).toLocaleDateString("en-GB")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  Company
                </span>

                <span className="font-semibold">
                  {current?.customer_name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  Fabric
                </span>

                <span className="font-semibold">
                  {current?.fabric_name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  Meters
                </span>

                <span className="font-semibold text-green-600">
                  {current?.total_meters}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  DC Number
                </span>

                <span className="font-semibold">
                  {current?.dispatch_no}
                </span>
              </div>

            </div>
            
            {/* Customer Card */}

            <div className="
              w-full
              lg:w-[220px]
              min-h-[190px]
              p-6 mt-8
              flex
              flex-col
              items-center
              justify-center
              bg-blue-50
              border-5
              border-blue-200
              shadow-md
              rounded-2xl
            ">

              <div className="w-24 h-24 rounded-full bg-blue-700 text-white flex items-center justify-center text-2xl font-bold">
                {customerInitials}
              </div>

              <p className="
                mt-4
                font-bold
                text-lg
                text-slate-800
                text-center
                max-w-[180px]
                break-words
              ">
                {current?.customer_name}
              </p>

              <p className="text-sm text-slate-500">
                Customer
              </p>

            </div>

          </div>

        </div>

        {/* Dots */}

        <div className="flex justify-center gap-2 mt-4">

          {dispatches.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index
                  ? "w-8 h-3 bg-blue-700"
                  : "w-3 h-3 bg-slate-300"
              }`}
            />
          ))}

        </div>
    </>
    )
}
export default DispatchCard;