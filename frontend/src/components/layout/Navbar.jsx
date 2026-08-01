import { useState } from "react";
import {
  UserCircle,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/sakthi_textile_logo.png";
import api from "../../services/api";

function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;
  const userRole = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase(); // Converts ADMIN to Admin && USER to User
  const isAdmin = user?.role === "ADMIN";

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Barcodes", path: "/barcode" },
    { name: "Stocks", path: "/stocks" },
    { name: "Dispatch", path: "/dispatch" },
  ];

  const handleLogout = async () => {

    try {

      await api.post("accounts/logout/", {
        refresh: localStorage.getItem("refresh"),
      });

    } catch (err) {

      console.error(err);

    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    navigate("/login");

  };

  return (
    <div className="relative">

      <header
        className="
          bg-white
          border-b
          border-slate-200
          px-4
          md:px-12
          h-20
          flex
          items-center
          justify-between
        "
      >

        {/* Logo */}
        <img
          src={logo}
          alt="Sakthi Textiles"
          className="w-32 md:w-36 object-contain"
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">

          <nav className="flex items-center gap-10 text-sm font-medium">

            {navItems.map((item) => (

              <Link
                key={item.path}
                to={item.path}
                className={`relative ${
                  location.pathname === item.path
                    ? "text-blue-700 font-semibold"
                    : "text-slate-700 hover:text-blue-700"
                }`}
              >

                {item.name}

                {location.pathname === item.path && (
                  <span
                    className="
                      absolute
                      left-0
                      -bottom-4
                      w-full
                      h-[2px]
                      bg-blue-700
                    "
                  />
                )}

              </Link>

            ))}

          </nav>

          {/* Profile Dropdown */}
          <div className="relative">

            <button
              onClick={() =>
                setShowMenu(!showMenu)
              }
              className="
                flex
                items-center
                gap-2
                px-3
                py-2
                border-2
                border-blue-700
                rounded-full
                hover:bg-slate-100
              "
            >

              <UserCircle
                size={32}
                className="text-blue-700"
              />

              <ChevronDown
                size={16}
                className="text-slate-500"
              />

            </button>

            {showMenu && (

              <div
                className="
                  absolute
                  right-0
                  top-14
                  z-50
                  w-73
                  max-w-[calc(100vw-2rem)]
                  overflow-hidden
                  bg-white
                  rounded-xl
                  shadow-lg
                  border
                  border-slate-200
                "
              >

                <div className="px-4 py-3 border-b border-slate-200">

                  <p className="mb-1 text-sm text-slate-500">
                    Signed in as
                  </p>

                  <div className="flex items-center justify-between gap-4">

                    <p className="min-w-0 flex-1 truncate font-semibold text-slate-800">
                      {username}
                    </p>

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${
                          isAdmin
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {userRole}
                    </span>

                  </div>

                </div>

                {isAdmin && (

                  <Link
                    to="/users"
                    onClick={() => setShowMenu(false)}
                    className="
                      w-full
                      px-4
                      py-3
                      flex
                      items-center
                      gap-3
                      text-slate-700
                      hover:bg-blue-50
                      hover:text-blue-700
                      transition
                    "
                  >
                    <Users size={18} />
                    User Management

                  </Link>

                )}

                <button
                  onClick={handleLogout}
                  className="
                    w-full
                    px-4
                    py-3
                    flex
                    items-center
                    gap-3
                    text-red-600
                    hover:bg-red-50
                    rounded-b-xl
                  "
                >

                  <LogOut size={18} />
                  Logout

                </button>

              </div>

            )}

          </div>

        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >

          {menuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}

        </button>

      </header>

      {/* Mobile Menu */}
      {menuOpen && (

        <div
          className="
            md:hidden
            bg-white
            shadow-lg
            border-b
            border-slate-200
            absolute
            top-20
            left-0
            right-0
            z-50
          "
        >

          <div className="flex flex-col">

            {navItems.map((item) => (

              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  setMenuOpen(false)
                }
                className={`
                  px-5
                  py-4
                  border-b
                  border-slate-100
                  ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : ""
                  }
                `}
              >

                {item.name}

              </Link>

            ))}

            <div className="px-5 py-4">

              <p className="text-sm text-slate-500">
                Signed in as
              </p>

              <p className="font-semibold mb-3">
                {username}
              </p>

              <button
                onClick={handleLogout}
                className="
                  flex
                  items-center
                  gap-2
                  text-red-600
                  font-medium
                "
              >

                <LogOut size={18} />
                Logout

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Navbar;