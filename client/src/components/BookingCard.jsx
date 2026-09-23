import { useDispatch } from "react-redux";
import { cancelBooking, checkInBooking } from "../features/bookings/bookingsSlice";

const statusBadge = {
  BOOKED: "bg-blue-100 text-blue-700",
  CHECKED_IN: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  EXPIRED: "bg-red-100 text-red-600",
};

export default function BookingCard({ booking }) {
  const dispatch = useDispatch();
  const date = new Date(booking.bookingDate).toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-gray-900">
            Desk {booking.desk?.deskNumber ?? "N/A"} &mdash; Zone {booking.desk?.zone ?? "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            {booking.floor?.name ?? "Floor N/A"} &bull; {date}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{booking.timeSlot?.replace("_", " ")}</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge[booking.status]}`}
        >
          {booking.status}
        </span>
      </div>

      {booking.status === "BOOKED" && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => dispatch(checkInBooking(booking._id))}
            className="flex-1 text-sm bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg transition-colors"
          >
            Check In
          </button>
          <button
            onClick={() => dispatch(cancelBooking(booking._id))}
            className="flex-1 text-sm bg-white hover:bg-red-50 text-red-500 border border-red-200 py-1.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {booking.status === "CHECKED_IN" && (
        <p className="text-xs text-green-600 mt-3 pt-3 border-t border-gray-100">
          ✅ Checked in at {new Date(booking.checkedInAt).toLocaleTimeString("en-IN")}
        </p>
      )}
    </div>
  );
}
