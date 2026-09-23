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

const TABS = [
  { key: "Stats", label: "Analytics Overview", icon: "📊" },
  { key: "Users", label: "User Access", icon: "👥" },
  { key: "All Bookings", label: "All Reservations", icon: "📑" },
  { key: "Floors", label: "Floor & Desk Setup", icon: "🏢" },
];

const statusBadge = {
  BOOKED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  CHECKED_IN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
  EXPIRED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AdminPage() {
  const dispatch = useDispatch();
  const { stats, users, allBookings, isLoading } = useSelector((state) => state.admin);
  const { floors } = useSelector((state) => state.floors);
  const [activeTab, setActiveTab] = useState("Stats");

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              Admin Portal
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">System Management</h1>
          <p className="text-gray-500 text-sm">
            Control user access roles, inspect bookings, and configure office floor capacities.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl w-fit mb-8 border border-gray-200/60 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-purple-700 shadow-sm shadow-purple-100"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 1. Stats Tab ── */}
      {activeTab === "Stats" && (
        <div>
          {isLoading ? (
            <p className="text-gray-400 text-xs">Loading analytics...</p>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="indigo" />
              <StatCard label="Total Floors" value={stats.totalFloors} icon="🏢" color="blue" />
              <StatCard label="Active Desks" value={stats.totalDesks} icon="🪑" color="purple" />
              <StatCard label="Booked Desks" value={stats.activeBookings} icon="✅" color="emerald" />
              <StatCard label="Waitlist Count" value={stats.waitlistedCount} icon="⏳" color="amber" />
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No statistics available.</p>
          )}
        </div>
      )}

      {/* ── 2. Users Tab ── */}
      {activeTab === "Users" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm">Registered Accounts ({users.length})</h2>
            <p className="text-xs text-gray-400">Promote employees to Administrator or demote</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3 font-bold">User</th>
                  <th className="px-6 py-3 font-bold">Email</th>
                  <th className="px-6 py-3 font-bold">Role</th>
                  <th className="px-6 py-3 font-bold">Team</th>
                  <th className="px-6 py-3 font-bold text-right">Access Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-gray-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {u.name?.slice(0, 1).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{u.email}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.role === "ADMIN"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{u.team?.name || "General"}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        className={`text-xs font-semibold px-3 py-1 rounded-xl border transition-all ${
                          u.role === "ADMIN"
                            ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                            : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                        }`}
                      >
                        Make {u.role === "ADMIN" ? "Employee" : "Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 3. All Bookings Tab ── */}
      {activeTab === "All Bookings" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm">System Bookings Ledger ({allBookings.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3 font-bold">User</th>
                  <th className="px-6 py-3 font-bold">Desk / Zone</th>
                  <th className="px-6 py-3 font-bold">Floor</th>
                  <th className="px-6 py-3 font-bold">Date</th>
                  <th className="px-6 py-3 font-bold">Slot</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-gray-900">{b.user?.name ?? "—"}</td>
                    <td className="px-6 py-3.5 text-gray-600">
                      Desk {b.desk?.deskNumber ?? "—"} (Zone {b.desk?.zone ?? "A"})
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{b.floor?.name ?? "—"}</td>
                    <td className="px-6 py-3.5 text-gray-600">
                      {new Date(b.bookingDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{b.timeSlot?.replace("_", " ")}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          statusBadge[b.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {allBookings.length === 0 && (
            <p className="text-center text-gray-400 text-xs py-10">No bookings on record.</p>
          )}
        </div>
      )}

      {/* ── 4. Floors Setup Tab ── */}
      {activeTab === "Floors" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Floor list */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Office Floors ({floors.length})
            </h2>
            <div className="space-y-3">
              {floors.length === 0 ? (
                <p className="text-gray-400 text-xs">No floors configured yet.</p>
              ) : (
                floors.map((f) => {
                  const pct = Math.round((f.occupiedCount / f.capacity) * 100);
                  return (
                    <div
                      key={f._id}
                      className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          Floor {f.floorNumber} &mdash; {f.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {f.occupiedCount} of {f.capacity} desks reserved
                        </p>
                      </div>

                      <div className="w-28 text-right">
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-1">
                          <div
                            className={`h-2 rounded-full ${
                              pct > 80 ? "bg-rose-500" : pct > 50 ? "bg-amber-500" : "bg-indigo-600"
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{pct}% Occupied</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Add Floor Form */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Create New Floor
            </h2>
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs">
              {floorMsg && (
                <div
                  className={`text-xs font-semibold p-3 rounded-xl mb-4 border ${
                    floorMsg.includes("success")
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {floorMsg}
                </div>
              )}

              <form onSubmit={handleFloorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Floor Number
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={floorForm.floorNumber}
                    onChange={(e) => setFloorForm({ ...floorForm, floorNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    placeholder="e.g. 1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Floor Name / Department
                  </label>
                  <input
                    type="text"
                    required
                    value={floorForm.name}
                    onChange={(e) => setFloorForm({ ...floorForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    placeholder="e.g. Engineering Wing"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Total Desk Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={floorForm.capacity}
                    onChange={(e) => setFloorForm({ ...floorForm, capacity: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    placeholder="e.g. 40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-purple-600/20 text-xs transition-all"
                >
                  Save Floor
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
