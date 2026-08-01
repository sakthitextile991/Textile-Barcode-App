function DeleteUserModal({

  isOpen,

  user,

  onClose,

  onConfirm,

}) {

  if (
    !isOpen
    ||
    !user
  ) {

    return null;

  }


  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-950/50
        p-4
        backdrop-blur-sm
      "
    >

      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          bg-white
          p-6
          shadow-2xl
        "
      >

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-red-100
            text-xl
          "
        >

          !

        </div>


        <h2
          className="
            mt-5
            text-xl
            font-bold
            text-slate-900
          "
        >

          Delete User?

        </h2>


        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-500
          "
        >

          You are about to permanently
          delete

          <span
            className="
              mx-1
              font-semibold
              text-slate-800
            "
          >

            @{user.username}

          </span>

          from the system.

          This action cannot be undone.

        </p>


        <div
          className="
            mt-7
            flex
            justify-end
            gap-3
          "
        >

          <button

            onClick={
              onClose
            }

            className="
              rounded-xl
              border
              border-slate-200
              px-5
              py-3
              font-semibold
              text-slate-600
            "

          >

            Cancel

          </button>


          <button

            onClick={
              onConfirm
            }

            className="
              rounded-xl
              bg-red-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
            "

          >

            Delete User

          </button>

        </div>

      </div>

    </div>

  );

}


export default DeleteUserModal;