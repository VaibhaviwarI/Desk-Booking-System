import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookings } from "../features/bookings/bookingsSlice";
import BookingCard from "../components/BookingCard";

const FILTERS = [
  { key: "All", label: "All Reservations" },
  { key: "BOOKED", label: "Upcoming / Active" },
  { key: "CHECKED_IN", label: "Checked In" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "EXPIRED", label: "Expired" },
];

export default function MyBookingsPage() {
  const dispatch = useDispatch();
  const { myBookings, isLoading, error } = useSelector((state) => state.bookings);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, []);

  const filtered =
    activeFilter === "All"
      ? myBookings
      : myBookings.filter((b) => b.status === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Desk Reservations</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track, check-in to, or cancel your office desk bookings.
          </p>
        </div>
        <Link
          to="/book"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all w-fit"
        >
          <span>+</span>
          <span>Book Another Desk</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {FILTERS.map((f) => {
          const count =
            f.key === "All"
              ? myBookings.length
              : myBookings.filter((b) => b.status === f.key).length;

          const isActive = activeFilter === f.key;

          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-gray-100 p-5 h-48 animate-pulse bg-gray-50"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center text-xl mx-auto mb-3">
            🔍
          </div>
          <p className="font-bold text-gray-700 text-sm">No reservations found</p>
          <p className="text-gray-400 text-xs mt-1">There are no bookings matching the selected filter.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
