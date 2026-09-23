import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyWaitlist, cancelWaitlist } from "../features/waitlist/waitlistSlice";

const statusConfig = {
  WAITLISTED: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Waitlisted",
    icon: "⏳",
  },
  ASSIGNED: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Assigned & Booked",
    icon: "🎉",
  },
  EXPIRED: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    label: "Expired",
    icon: "❌",
  },
  CANCELLED: {
    badge: "bg-gray-100 text-gray-500 border-gray-200",
    label: "Cancelled",
    icon: "🚫",
  },
};

export default function WaitlistPage() {
  const dispatch = useDispatch();
  const { myWaitlist, isLoading, error } = useSelector((state) => state.waitlist);

  useEffect(() => {
    dispatch(fetchMyWaitlist());
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Waitlist Requests</h1>
        <p className="text-gray-500 text-sm mt-1">
          When booked desks are released or someone misses check-in, our automated system reallocates desks to waitlisted members first.
        </p>
      </div>

      {/* Info explanation card */}
      <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-yellow-50/60 border border-amber-200/70 rounded-3xl p-5 mb-6 text-xs text-amber-900 flex items-start gap-3">
        <span className="text-2xl">⚡</span>
        <div>
          <p className="font-bold text-amber-950 mb-0.5">How Automatic Reassignment Works</p>
          <p className="text-amber-800 leading-relaxed">
            Our background job regularly evaluates no-shows. If a reserved desk is not checked in on time, the system uses an atomic MongoDB transaction to mark the booking expired and immediately reassigns the desk to the earliest waitlisted request.
          </p>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {/* Waitlist list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-100 p-5 h-24 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : myWaitlist.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mx-auto mb-3">
            ✨
          </div>
          <p className="font-bold text-gray-800 text-base mb-1">Your waitlist is empty</p>
          <p className="text-gray-400 text-xs max-w-sm mx-auto mb-4">
            You don't have any pending waitlist reservations. If a floor is fully booked, you can join the queue.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            <span>Book a desk instead</span>
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myWaitlist.map((entry) => {
            const status = statusConfig[entry.status] || statusConfig.WAITLISTED;
            const dateStr = new Date(entry.bookingDate).toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={entry._id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg border border-amber-100">
                    {status.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {entry.floor?.name ?? "Floor"} (Floor {entry.floor?.floorNumber ?? "—"})
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>📅 {dateStr}</span>
                      <span>&bull;</span>
                      <span>⏰ {entry.timeSlot?.replace("_", " ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.badge}`}
                  >
                    <span>{status.icon}</span>
                    <span>{status.label}</span>
                  </span>

                  {entry.status === "WAITLISTED" && (
                    <button
                      onClick={() => dispatch(cancelWaitlist(entry._id))}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-100 transition-all"
                    >
                      Leave Waitlist
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
