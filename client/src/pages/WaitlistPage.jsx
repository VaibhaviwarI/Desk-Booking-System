import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyWaitlist, cancelWaitlist } from "../features/waitlist/waitlistSlice";

const statusBadge = {
  WAITLISTED: "bg-yellow-100 text-yellow-700",
  ASSIGNED: "bg-green-100 text-green-700",
  EXPIRED: "bg-red-100 text-red-600",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function WaitlistPage() {
  const dispatch = useDispatch();
  const { myWaitlist, isLoading, error } = useSelector((state) => state.waitlist);

  useEffect(() => {
    dispatch(fetchMyWaitlist());
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Waitlist</h1>
      <p className="text-gray-500 text-sm mb-6">
        You are automatically moved from waitlist to a desk when one becomes available.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : myWaitlist.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400">You are not on any waitlist.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myWaitlist.map((entry) => (
            <div
              key={entry._id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {entry.floor?.name ?? "Floor N/A"}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {new Date(entry.bookingDate).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  &bull; {entry.timeSlot?.replace("_", " ")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Added {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge[entry.status]}`}
                >
                  {entry.status}
                </span>
                {entry.status === "WAITLISTED" && (
                  <button
                    onClick={() => dispatch(cancelWaitlist(entry._id))}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
