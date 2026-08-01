function UserTable({

  users,

  onEdit,

  onStatusChange,

  onRoleChange,

  onDelete,

}) {

  return (

    <div
      className="
        overflow-x-auto
      "
    >

      <table
        className="
          min-w-full
        "
      >

        <thead>

          <tr className="text-[15px] bg-blue-900 text-white uppercase">

            <th className="px-6 py-4 text-left font-semibold tracking-wider">
              User
            </th>


            <th className="px-6 py-4 text-left font-semibold tracking-wider">
              Role
            </th>


            <th className="px-6 py-4 text-left font-semibold tracking-wider">
              Status
            </th>


            <th className="px-6 py-4 text-left font-semibold tracking-wider">
              Joined
            </th>


            <th className="px-6 py-4 text-right font-semibold tracking-wider">
              Actions
            </th>

          </tr>

        </thead>


        <tbody>

          {users.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="
                  px-6
                  py-16
                  text-center
                "
              >

                <div
                  className="
                    text-4xl
                  "
                >

                  👤

                </div>


                <h3
                  className="
                    mt-4
                    font-semibold
                    text-slate-800
                  "
                >

                  No users found

                </h3>


                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >

                  Try changing your
                  search or filters.

                </p>

              </td>

            </tr>

          ) : (

            users.map(
              (user) => (

                <tr

                  key={
                    user.id
                  }

                  className="
                    border-t
                    border-slate-100
                    transition
                    hover:bg-slate-50
                  "

                >

                  {/* User */}

                  <td
                    className="
                      px-6
                      py-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-100
                          font-bold
                          text-blue-700
                        "
                      >

                        {
                          user.username
                            .charAt(0)
                            .toUpperCase()
                        }

                      </div>


                      <div>

                        <p
                          className="
                            font-semibold
                            text-slate-800
                          "
                        >

                          {
                            user.first_name
                          }
                          {" "}
                          {
                            user.last_name
                          }

                        </p>


                        <p
                          className="
                            text-sm
                            text-slate-500
                          "
                        >

                          @
                          {
                            user.username
                          }

                        </p>


                        <p
                          className="
                            mt-0.5
                            text-xs
                            text-slate-400
                          "
                        >

                          {
                            user.email
                          }

                        </p>

                      </div>

                    </div>

                  </td>


                  {/* Role */}

                  <td
                    className="
                      px-6
                      py-4
                    "
                  >

                    <select

                      value={
                        user.role
                      }

                      onChange={
                        (event) =>

                          onRoleChange(
                            user,
                            event.target.value
                          )
                      }

                      className={`
                        rounded-lg
                        border
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        outline-none

                        ${
                          user.role
                          === "ADMIN"

                            ? `
                              border-purple-200
                              bg-purple-50
                              text-purple-700
                            `

                            : `
                              border-blue-200
                              bg-blue-50
                              text-blue-700
                            `
                        }
                      `}

                    >

                      <option value="ADMIN">

                        ADMIN

                      </option>

                      <option value="USER">

                        USER

                      </option>

                    </select>

                  </td>


                  {/* Status */}

                  <td
                    className="
                      px-6
                      py-4
                    "
                  >

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold

                        ${
                          user.is_active

                            ? `
                              bg-emerald-100
                              text-emerald-700
                            `

                            : `
                              bg-red-100
                              text-red-700
                            `
                        }
                      `}
                    >

                      {
                        user.is_active

                          ? "Active"

                          : "Inactive"
                      }

                    </span>

                  </td>


                  {/* Joined */}

                  <td
                    className="
                      whitespace-nowrap
                      px-6
                      py-4
                      text-sm
                      text-slate-500
                    "
                  >

                    {
                      new Date(
                        user.date_joined
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day:
                            "2-digit",

                          month:
                            "short",

                          year:
                            "numeric",
                        }
                      )
                    }

                  </td>


                  {/* Actions */}

                  <td
                    className="
                      px-6
                      py-4
                    "
                  >

                    <div
                      className="
                        flex
                        justify-end
                        gap-2
                      "
                    >

                      <button

                        onClick={() =>

                          onEdit(
                            user
                          )
                        }

                        className="
                          rounded-lg
                          border
                          border-slate-200
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-slate-600
                          transition
                          hover:border-blue-200
                          hover:bg-blue-50
                          hover:text-blue-700
                        "

                      >

                        Edit

                      </button>


                      <button

                        onClick={() =>

                          onStatusChange(
                            user
                          )
                        }

                        className="
                          rounded-lg
                          border
                          border-slate-200
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-slate-600
                          transition
                          hover:bg-slate-100
                        "

                      >

                        {
                          user.is_active

                            ? "Deactivate"

                            : "Activate"
                        }

                      </button>


                      <button

                        onClick={() =>

                          onDelete(
                            user
                          )
                        }

                        className="
                          rounded-lg
                          border
                          border-red-200
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-red-600
                          transition
                          hover:bg-red-50
                        "

                      >

                        Delete

                      </button>

                    </div>

                  </td>

                </tr>

              )
            )

          )}

        </tbody>

      </table>

    </div>

  );

}


export default UserTable;