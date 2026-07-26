import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

function DeleteBarcodeDialog({
  open,
  barcode,
  onClose,
  onConfirm,
}) {

  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    if (open) {
      setConfirmation("");
    }
  }, [open]);

  if (!open || !barcode) return null;

  const canDelete = confirmation.trim().toLocaleLowerCase() === "confirm";

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (canDelete) {
            onConfirm(barcode.id);
          }
        }}
      >

        <div
          className="
            w-full
            max-w-2xl
            bg-white
            rounded-3xl
            shadow-2xl
            border
            border-slate-200
            overflow-hidden
            mx-4
          "
        >

          {/* Header */}

          <div
            className="
              flex
              items-center
              justify-between
              px-8
              py-6
              border-b
              border-slate-200
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-red-100
                  flex
                  items-center
                  justify-center
                "
              >

                <AlertTriangle
                  size={28}
                  className="text-red-600"
                />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-blue-950">
                  Delete Barcode
                </h2>

                <p className="text-slate-500">
                  This action cannot be undone.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                p-2
                rounded-full
                hover:bg-slate-100
              "
            >

              <X size={22} />

            </button>

          </div>

          {/* Barcode Details */}

          <div className="p-8">

            <div
              className="
                bg-slate-50
                rounded-2xl
                border
                border-slate-200
                p-6
              "
            >

              <div className="grid grid-cols-2 gap-y-5">

                <div>

                  <p className="text-sm text-slate-500">
                    Barcode
                  </p>

                  <p className="font-semibold text-blue-900">
                    {barcode.barcode}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Roll Number
                  </p>

                  <p className="font-semibold">
                    {barcode.roll_no}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Fabric
                  </p>

                  <p className="font-semibold">
                    {barcode.fabric_name}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Quantity
                  </p>

                  <p className="font-semibold">
                    {barcode.meters} Mtrs
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Weight
                  </p>

                  <p className="font-semibold">
                    {barcode.weight} Kg
                  </p>

                </div>

              </div>

            </div>

            {/* Warning */}

            <div
              className="
                mt-8
                rounded-2xl
                bg-red-50
                border
                border-red-200
                p-5
              "
            >

              <p className="font-semibold text-red-700">

                This permanently deletes the barcode and updates
                the fabric stock.

              </p>

              <p className="mt-2 text-sm text-red-600">

                To continue, type the barcode exactly as shown below.

              </p>

            </div>

            {/* Input */}

            <div className="mt-6">

              <label className="text-sm text-slate-600">

                Type <span className="font-bold">"Confirm"</span> to permanently delete the barcode

              </label>

              <input
                autoFocus
                value={confirmation}
                onChange={(e) =>
                  setConfirmation(e.target.value)
                }
                className="
                  mt-2
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-blue-700
                "
              />

            </div>

          </div>

          {/* Footer */}

          <div
            className="
              border-t
              border-slate-200
              px-8
              py-6
              flex
              justify-end
              gap-4
            "
          >

            <button
              type="button"
              onClick={onClose}
              className="
                px-6
                py-3
                rounded-xl
                border
                border-slate-300
                hover:bg-slate-100
              "
            >

              Cancel

            </button>

            <button
              type="submit"
              disabled={!canDelete}
              onClick={() => onConfirm(barcode.id)}
              className={`
                flex
                items-center
                gap-2
                px-6
                py-3
                rounded-xl
                text-white
                font-semibold
                transition

                ${
                  canDelete
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }
              `}
            >

              <Trash2 size={18} />

              Delete Barcode

            </button>

          </div>

        </div>
      </form>

    </div>

  );

}

export default DeleteBarcodeDialog;