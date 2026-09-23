import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFloors } from "../features/floors/floorsSlice";
import { bookDesk, clearBookingMessages } from "../features/bookings/bookingsSlice";

const TIME_SLOTS = [
  { value: "FULL_DAY", label: "Full Day" },
  { value: "FIRST_HALF", label: "First Half (AM)" },
  { value: "SECOND_HALF", label: "Second Half (PM)" },
];

// Minimum date = today
const today = new Date().toISOString().split("T")[0];

export default function BookDeskPage() {
  const dispatch = useDispatch();
  const { floors, isLoading: floorsLoading } = useSelector((state) => state.floors);
  const { isLoading, error, successMessage } = useSelector((state) => state.bookings);

  const [form, setForm] = useState({
    floorId: "",
    bookingDate: today,
    timeSlot: "FULL_DAY",
  });

  useEffect(() => {
    dispatch(fetchFloors());
    return () => dispatch(clearBookingMessages());
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(bookDesk(form));
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Book a Desk</h1>
      <p className="text-gray-500 text-sm mb-8">
        Select a floor, date, and time slot. A desk will be automatically assigned near your team.
      </p>

      {/* Success */}
      {successMessage && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 border border-green-200">
          ✅ {successMessage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Floor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Floor
            </label>
            {floorsLoading ? (
              <p className="text-sm text-gray-400">Loading floors...</p>
            ) : (
              <select
                name="floorId"
                required
                value={form.floorId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">— Select a floor —</option>
                {floors.map((f) => (
                  <option key={f._id} value={f._id}>
                    Floor {f.floorNumber} — {f.name} ({f.occupiedCount}/{f.capacity} occupied)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking Date
            </label>
            <input
              type="date"
              name="bookingDate"
              required
              min={today}
              value={form.bookingDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <label
                  key={slot.value}
                  className={`flex items-center justify-center text-sm py-2.5 rounded-lg border cursor-pointer transition-colors ${
                    form.timeSlot === slot.value
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-medium"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot.value}
                    checked={form.timeSlot === slot.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {slot.label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !form.floorId}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isLoading ? "Booking..." : "Book Desk"}
          </button>
        </form>
      </div>

      {/* Info box */}
      <div className="mt-5 bg-blue-50 rounded-xl p-4 text-sm text-blue-700 border border-blue-100">
        <p className="font-medium mb-1">How desk assignment works</p>
        <ul className="space-y-1 text-blue-600 list-disc list-inside">
          <li>If you have a fixed desk, it's always assigned to you.</li>
          <li>Otherwise, you get the desk closest to your team's cluster.</li>
          <li>If the floor is full, you're added to the waitlist automatically.</li>
        </ul>
      </div>
    </div>
  );
}
