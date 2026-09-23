import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminStats,
  fetchAllUsers,
  updateUserRole,
  fetchAllBookings,
} from "../features/admin/adminSlice";
import { fetchFloors, createFloor } from "../features/floors/floorsSlice";
import StatCard from "../components/StatCard";

const TABS = ["Stats", "Users", "All Bookings", "Floors"];

const statusBadge = {
  BOOKED: "bg-blue-100 text-blue-700",
  CHECKED_IN: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  EXPIRED: "bg-red-100 text-red-600",
};

export default function AdminPage() {
  const dispatch = useDispatch();
  const { stats, users, allBookings, isLoading } = useSelector((state) => state.admin);
  const { floors } = useSelector((state) => state.floors);
  const [activeTab, setActiveTab] = useState("Stats");

  // New floor form
  const [floorForm, setFloorForm] = useState({ floorNumber: "", name: "", capacity: "" });
  const [floorMsg, setFloorMsg] = useState("");

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAllUsers());
    dispatch(fetchAllBookings());
    dispatch(fetchFloors());
  }, []);

  const handleRoleToggle = (user) => {
    const newRole = user.role === "ADMIN" ? "EMPLOYEE" : "ADMIN";
    dispatch(updateUserRole({ userId: user._id, role: newRole }));
  };

  const handleFloorSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      createFloor({
        floorNumber: Number(floorForm.floorNumber),
        name: floorForm.name,
        capacity: Number(floorForm.capacity),
      })
    );
    if (result.meta.requestStatus === "fulfilled") {
      setFloorMsg("Floor created successfully!");
      setFloorForm({ floorNumber: "", name: "", capacity: "" });
    } else {
      setFloorMsg(result.payload || "Failed to create floor.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</h1>
      <p className="text-gray-500 text-sm mb-6">Manage users, floors, and bookings.</p>

      {/* Tab Buttons */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Stats Tab ── */}
      {activeTab === "Stats" && (
        <div>
          {isLoading ? (
            <p className="text-gray-400 text-sm">Loading stats...</p>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard label="Total Users" value={stats.totalUsers} color="indigo" />
              <StatCard label="Total Floors" value={stats.totalFloors} color="blue" />
              <StatCard label="Total Desks" value={stats.totalDesks} color="yellow" />
              <StatCard label="Active Bookings" value={stats.activeBookings} color="green" />
              <StatCard label="On Waitlist" value={stats.waitlistedCount} color="red" />
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No stats available.</p>
          )}
        </div>
      )}

      {/* ── Users Tab ── */}
      {activeTab === "Users" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Team</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-5 py-3 text-gray-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.role === "ADMIN"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{user.team?.name || "—"}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleRoleToggle(user)}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Make {user.role === "ADMIN" ? "Employee" : "Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── All Bookings Tab ── */}
      {activeTab === "All Bookings" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Desk</th>
                <th className="px-5 py-3 font-medium">Floor</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Slot</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {b.user?.name ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {b.desk?.deskNumber} / {b.desk?.zone}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{b.floor?.name ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(b.bookingDate).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {b.timeSlot?.replace("_", " ")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allBookings.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No bookings found.</p>
          )}
        </div>
      )}

      {/* ── Floors Tab ── */}
      {activeTab === "Floors" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Existing Floors */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">All Floors</h2>
            <div className="space-y-2">
              {floors.length === 0 ? (
                <p className="text-gray-400 text-sm">No floors yet.</p>
              ) : (
                floors.map((f) => (
                  <div
                    key={f._id}
                    className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        Floor {f.floorNumber} — {f.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {f.occupiedCount} / {f.capacity} occupied
                      </p>
                    </div>
                    {/* Occupancy bar */}
                    <div className="w-24">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-indigo-500 rounded-full"
                          style={{
                            width: `${Math.min((f.occupiedCount / f.capacity) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 text-right mt-0.5">
                        {Math.round((f.occupiedCount / f.capacity) * 100)}%
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add New Floor */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Add New Floor</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              {floorMsg && (
                <div
                  className={`text-sm px-3 py-2 rounded-lg mb-4 ${
                    floorMsg.includes("success")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {floorMsg}
                </div>
              )}
              <form onSubmit={handleFloorSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor Number
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={floorForm.floorNumber}
                    onChange={(e) => setFloorForm({ ...floorForm, floorNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor Name
                  </label>
                  <input
                    type="text"
                    required
                    value={floorForm.name}
                    onChange={(e) => setFloorForm({ ...floorForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Ground Floor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (desks)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={floorForm.capacity}
                    onChange={(e) => setFloorForm({ ...floorForm, capacity: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  Add Floor
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
