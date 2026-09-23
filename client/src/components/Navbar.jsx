import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const navLinks = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/book", label: "Book Desk", icon: "🪑" },
  { to: "/my-bookings", label: "My Bookings", icon: "📅" },
  { to: "/waitlist", label: "Waitlist", icon: "⏳" },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-indigo-50 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            🏢
          </div>
          <div>
            <span className="font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg tracking-tight">
              DeskBook
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
              Workspace
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl border border-gray-200/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-sm shadow-indigo-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                location.pathname === "/admin"
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-200"
                  : "text-purple-700 hover:bg-purple-50"
              }`}
            >
              <span>⚙️</span>
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {getInitials(user?.name)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-gray-800 leading-tight">{user?.name}</p>
              <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="text-xs font-medium text-gray-500 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-rose-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-gray-100 px-2 py-1.5 bg-slate-50/50">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-[11px] font-medium px-2 py-1 rounded-lg ${
              location.pathname === link.to ? "text-indigo-600 font-bold bg-indigo-50" : "text-gray-500"
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className={`text-[11px] font-medium px-2 py-1 rounded-lg ${
              location.pathname === "/admin" ? "text-purple-700 font-bold bg-purple-50" : "text-purple-600"
            }`}
          >
            ⚙️ Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
