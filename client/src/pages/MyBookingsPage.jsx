import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "../features/bookings/bookingsSlice";
import BookingCard from "../components/BookingCard";

const FILTERS = ["All", "BOOKED", "CHECKED_IN", "CANCELLED", "EXPIRED"];

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Bookings</h1>
      <p className="text-gray-500 text-sm mb-6">All your desk reservations in one place.</p>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              activeFilter === f
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Bookings Grid */}
      {isLoading ? (
        <p className="text-gray-400 text-sm">Loading bookings...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400">No bookings found for this filter.</p>
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
