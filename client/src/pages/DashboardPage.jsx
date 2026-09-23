import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookings } from "../features/bookings/bookingsSlice";
import StatCard from "../components/StatCard";
import BookingCard from "../components/BookingCard";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myBookings, isLoading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, []);

  const activeBookings = myBookings.filter((b) => b.status === "BOOKED");
  const checkedIn = myBookings.filter((b) => b.status === "CHECKED_IN");
  const cancelled = myBookings.filter((b) => b.status === "CANCELLED");
  const recentBookings = [...myBookings].slice(0, 3);

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15 mb-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-indigo-100 mb-3 border border-white/20">
              <span>📅</span> {todayStr}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-indigo-100 text-sm mt-1.5 max-w-xl">
              Welcome to your workspace portal. Easily reserve desks, coordinate with teammates, or check in on arrival.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/book"
              className="bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <span>+</span>
              <span>Book a Desk</span>
            </Link>
            <Link
              to="/my-bookings"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all"
            >
              My Bookings
            </Link>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Stats Section */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Overview & Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Bookings"
            value={myBookings.length}
            icon="📋"
            color="indigo"
          />
          <StatCard
            label="Active Today"
            value={activeBookings.length}
            icon="🪑"
            color="blue"
          />
          <StatCard
            label="Checked In"
            value={checkedIn.length}
            icon="✅"
            color="emerald"
          />
          <StatCard
            label="Cancelled"
            value={cancelled.length}
            icon="🚫"
            color="rose"
          />
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
            <p className="text-xs text-gray-500">Your upcoming and latest workspace reservations</p>
          </div>
          {myBookings.length > 0 && (
            <Link
              to="/my-bookings"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <span>View all ({myBookings.length})</span>
              <span>→</span>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-gray-100 p-5 h-44 animate-pulse bg-gray-50"
              />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-3">
              🪑
            </div>
            <h3 className="font-bold text-gray-800 text-base mb-1">No reservations yet</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-5">
              You haven't reserved any desks yet. Pick a floor and time slot to secure your workspace.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>+ Book your first desk</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
