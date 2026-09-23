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
  const recentBookings = [...myBookings].slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Good {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's your workspace overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Bookings" value={myBookings.length} color="indigo" />
        <StatCard label="Active Bookings" value={activeBookings.length} color="blue" />
        <StatCard label="Checked In" value={checkedIn.length} color="green" />
        <StatCard
          label="Cancelled"
          value={myBookings.filter((b) => b.status === "CANCELLED").length}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/book"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            + Book a Desk
          </Link>
          <Link
            to="/my-bookings"
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            View All Bookings
          </Link>
          <Link
            to="/waitlist"
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            My Waitlist
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          <Link to="/my-bookings" className="text-sm text-indigo-600 hover:underline">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : recentBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
            <p className="text-gray-400">No bookings yet.</p>
            <Link
              to="/book"
              className="mt-3 inline-block text-sm text-indigo-600 font-medium hover:underline"
            >
              Book your first desk →
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
