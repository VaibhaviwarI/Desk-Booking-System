import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFloors } from "../features/floors/floorsSlice";
import { bookDesk, clearBookingMessages } from "../features/bookings/bookingsSlice";

const TIME_SLOTS = [
  { value: "FULL_DAY", label: "Full Day", icon: "☀️", sub: "9:00 AM - 6:00 PM" },
  { value: "FIRST_HALF", label: "Morning", icon: "🌅", sub: "9:00 AM - 1:30 PM" },
  { value: "SECOND_HALF", label: "Afternoon", icon: "🌇", sub: "1:30 PM - 6:00 PM" },
];

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

  const selectedFloor = floors.find((f) => f._id === form.floorId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reserve a Desk</h1>
        <p className="text-gray-500 text-sm mt-1">
          Choose a floor, date, and preferred slot. We'll automatically cluster you near your team.
        </p>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-2xl mb-6 shadow-xs animate-fadeIn">
          <span className="text-xl">🎉</span>
          <div>
            <p className="font-bold text-emerald-900">Booking Confirmed!</p>
            <p className="text-emerald-700 mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-800 text-sm p-4 rounded-2xl mb-6 shadow-xs animate-fadeIn">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold text-rose-900">Could not complete booking</p>
            <p className="text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Floor Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              1. Select Floor
            </label>
            {floorsLoading ? (
              <p className="text-xs text-gray-400">Loading floors...</p>
            ) : floors.length === 0 ? (
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                No floors found. Ask your administrator to create a floor in the Admin Panel.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {floors.map((floor) => {
                  const isSelected = form.floorId === floor._id;
                  const occupancyPct = Math.round((floor.occupiedCount / floor.capacity) * 100);
                  const isFull = floor.occupiedCount >= floor.capacity;

                  return (
                    <div
                      key={floor._id}
                      onClick={() => setForm({ ...form, floorId: floor._id })}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        isSelected
                          ? "bg-indigo-50/70 border-indigo-500 shadow-sm shadow-indigo-100"
                          : "border-gray-200 hover:border-indigo-200 hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-gray-900">
                          Floor {floor.floorNumber}
                        </span>
                        {isFull ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            Full
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Available
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{floor.name}</p>

                      {/* Mini occupancy bar */}
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            occupancyPct > 80 ? "bg-rose-500" : occupancyPct > 50 ? "bg-amber-500" : "bg-indigo-500"
                          }`}
                          style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 text-right">
                        {floor.occupiedCount} / {floor.capacity} occupied
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              2. Choose Date
            </label>
            <input
              type="date"
              name="bookingDate"
              required
              min={today}
              value={form.bookingDate}
              onChange={handleChange}
              className="w-full sm:w-72 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              3. Select Time Slot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TIME_SLOTS.map((slot) => {
                const isSelected = form.timeSlot === slot.value;
                return (
                  <div
                    key={slot.value}
                    onClick={() => setForm({ ...form, timeSlot: slot.value })}
                    className={`cursor-pointer rounded-2xl p-4 border text-center transition-all ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-500 shadow-sm shadow-indigo-100"
                        : "border-gray-200 hover:border-indigo-200 hover:bg-slate-50/60"
                    }`}
                  >
                    <span className="text-xl block mb-1">{slot.icon}</span>
                    <p className="font-bold text-sm text-gray-800">{slot.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{slot.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !form.floorId}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Reserving Desk...</span>
            ) : (
              <span>Confirm & Allocate Desk 🪑</span>
            )}
          </button>
        </form>
      </div>

      {/* Friendly Rule Guide */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 border border-indigo-100 rounded-3xl p-5 text-xs text-indigo-900">
        <p className="font-bold text-indigo-950 mb-2 flex items-center gap-1.5">
          <span>💡</span> Smart Allocation Highlights
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-indigo-800">
          <div className="bg-white/70 p-3 rounded-xl border border-indigo-100/60">
            <span className="font-bold block mb-0.5">📌 Fixed Desk Priority</span>
            If you own an assigned fixed desk, it will always be reserved for you.
          </div>
          <div className="bg-white/70 p-3 rounded-xl border border-indigo-100/60">
            <span className="font-bold block mb-0.5">👥 Team Centroid</span>
            Desks are chosen closest to where your teammates have already booked.
          </div>
          <div className="bg-white/70 p-3 rounded-xl border border-indigo-100/60">
            <span className="font-bold block mb-0.5">⏳ Instant Waitlist</span>
            If the floor is full, you are added to the waitlist and auto-promoted on no-show.
          </div>
        </div>
      </div>
    </div>
  );
}
