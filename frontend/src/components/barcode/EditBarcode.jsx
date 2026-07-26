import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import api from "../../services/api";

function EditBarcodeModal({
  open,
  barcode,
  onClose,
  onUpdated,
}) {
  const [meters, setMeters] = useState("");
  const [weight, setWeight] = useState("");
  const [machineNo, setMachineNo] = useState("");

  useEffect(() => {
    if (barcode) {
      setMeters(barcode.meters);
      setWeight(barcode.weight);
      setMachineNo(barcode.machine_no);
    }
  }, [barcode]);

  const handleSave = async () => {
    try {
      const res = await api.patch(
        `barcode/${barcode.id}/`,
        {
          meters,
          weight,
          machine_no: machineNo,
        }
      );

      onUpdated(res.data);
      onClose();
      
    } catch {
      alert("Update failed");
    }
  };

  if (!open || !barcode) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 p-2 rounded-full">
              <Pencil
                size={20}
                className="text-blue-700"
              />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Edit Barcode
              </h2>

              <p className="text-sm text-slate-500">
                Update roll details
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

            <div className="flex justify-between mb-2">

              <span className="text-slate-500">
                Roll Number
              </span>

              <span className="font-semibold text-slate-800">
                {barcode.roll_no}
              </span>

            </div>

            <div className="flex justify-between mb-2">

              <span className="text-slate-500">
                Barcode
              </span>

              <span className="font-semibold text-blue-700">
                {barcode.barcode}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Fabric
              </span>

              <span className="font-semibold">
                {barcode.fabric_name}
              </span>

            </div>

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quantity (Meters)
            </label>

            <input
              type="number"
              value={meters}
              onChange={(e) => setMeters(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                focus:border-blue-700
                focus:ring-2
                focus:ring-blue-100
                outline-none
              "
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Weight (Kg)
            </label>

            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                focus:border-blue-700
                focus:ring-2
                focus:ring-blue-100
                outline-none
              "
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Loom Number
            </label>

            <input
              type="number"
              value={machineNo}
              onChange={(e) => setMachineNo(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                focus:border-blue-700
                focus:ring-2
                focus:ring-blue-100
                outline-none
              "
            />

          </div>

        </div>

        {/* Footer */}

        <div className="px-6 py-5 border-t border-slate-200 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="
              px-5
              py-2.5
              rounded-xl
              border
              border-slate-300
              hover:bg-slate-50
              font-medium
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="
              px-5
              py-2.5
              rounded-xl
              bg-blue-700
              hover:bg-blue-800
              text-white
              font-medium
            "
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditBarcodeModal;