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


  const icon = [
      {
        emoji: "🧵",
        bg: "bg-blue-50",
        border: "border-blue-200",
      },
      {
        emoji: "✨",
        bg: "bg-green-50",
        border: "border-green-200",
      },
      {
        emoji: "🌾",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      },
      {
        emoji: "👑",
        bg: "bg-pink-50",
        border: "border-pink-200",
      },
      {
        emoji: "👖",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
      },
    ];



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
            
            {/* Fabric Icon */}

            <div className="w-full lg:h-[260px] lg:w-[300px] min-h-[190px] px-6 py-5 flex flex-col items-center justify-center bg-amber-100 rounded-xl">

              <div className=" text-4xl md:text-6xl">
                {icon[currentIndex % icon.length].emoji}
              </div>

              <div className="mt-4 text-center">

                <p className="max-w-[260px] text-center text-base font-bold leading-6 break-words line-clamp-2">
                  {current?.fabric_name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Fabric Type
                </p>

              </div>

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