import { useDispatch } from "react-redux";
import { cancelBooking, checkInBooking } from "../features/bookings/bookingsSlice";

const statusConfig = {
  BOOKED: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    label: "Booked",
  },
  CHECKED_IN: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Checked In",
  },
  CANCELLED: {
    badge: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
    label: "Cancelled",
  },
  EXPIRED: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    label: "Expired",
  },
};

const slotLabels = {
  FULL_DAY: "☀️ Full Day (9 AM - 6 PM)",
  FIRST_HALF: "🌅 First Half (9 AM - 1:30 PM)",
  SECOND_HALF: "🌇 Second Half (1:30 PM - 6 PM)",
};

export default function BookingCard({ booking }) {
  const dispatch = useDispatch();
  const date = new Date(booking.bookingDate).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const status = statusConfig[booking.status] || statusConfig.BOOKED;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Desk & Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
              🪑
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">
                Desk {booking.desk?.deskNumber ?? "Unassigned"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="font-medium text-indigo-600 bg-indigo-50/70 px-1.5 py-0.2 rounded">
                  Zone {booking.desk?.zone ?? "A"}
                </span>
                <span>&bull;</span>
                <span>{booking.floor?.name ?? "Floor"}</span>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
            {status.label}
          </span>
        </div>

        {/* Date and Slot Info */}
        <div className="space-y-1.5 bg-slate-50/80 rounded-xl p-3 text-xs text-gray-600 mb-4 border border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📅</span>
            <span className="font-medium text-gray-700">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">⏰</span>
            <span className="text-gray-700">{slotLabels[booking.timeSlot] || booking.timeSlot}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div>
        {booking.status === "BOOKED" && (
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => dispatch(checkInBooking(booking._id))}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs py-2 px-3 rounded-xl shadow-xs shadow-emerald-500/20 transition-all flex items-center justify-center gap-1"
            >
              <span>✓</span>
              <span>Check In</span>
            </button>
            <button
              onClick={() => dispatch(cancelBooking(booking._id))}
              className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        )}

        {booking.status === "CHECKED_IN" && (
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>✅ Checked in</span>
            <span className="text-emerald-600/80">
              {new Date(booking.checkedInAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
