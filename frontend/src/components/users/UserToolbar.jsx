import { Search } from "lucide-react";

function UserToolbar({

  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,

}) {

  return (

    <div
      className="
        grid
        gap-3
        lg:grid-cols-[1fr_180px_180px]
      "
    >

      {/* Search */}

      <div
        className="
          relative
        "
      >

        <Search
            size={18}
            className="
              absolute
              left-4
              top-4
              text-slate-400
            "
        />


        <input
          type="text"
          value={search}
          onChange={
            (event) =>
              setSearch(
                event.target.value
              )
          }
          placeholder="Search by username, name, or email..."

          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-3
            pl-11
            pr-4
            text-sm
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-100
          "
        />

      </div>


      {/* Role */}

      <select
        value={roleFilter}
        onChange={ (event) => setRoleFilter(event.target.value) }
        className="
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-3
          text-sm
          font-medium
          text-slate-700
          outline-none
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      >

        <option value="ALL">

          All Roles

        </option>

        <option value="ADMIN">

          Administrators

        </option>

        <option value="USER">

          Users

        </option>

      </select>


      {/* Status */}

      <select

        value={
          statusFilter
        }

        onChange={
          (event) =>

            setStatusFilter(
              event.target.value
            )
        }

        className="
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-3
          text-sm
          font-medium
          text-slate-700
          outline-none
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "

      >

        <option value="ALL">

          All Statuses

        </option>

        <option value="ACTIVE">

          Active

        </option>

        <option value="INACTIVE">

          Inactive

        </option>

      </select>

    </div>

  );

}


export default UserToolbar;