export default function StatCard({ label, value, icon = "📊", color = "indigo" }) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50/70",
      border: "border-indigo-100",
      text: "text-indigo-600",
      iconBg: "bg-indigo-100 text-indigo-700",
    },
    blue: {
      bg: "bg-blue-50/70",
      border: "border-blue-100",
      text: "text-blue-600",
      iconBg: "bg-blue-100 text-blue-700",
    },
    emerald: {
      bg: "bg-emerald-50/70",
      border: "border-emerald-100",
      text: "text-emerald-600",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    amber: {
      bg: "bg-amber-50/70",
      border: "border-amber-100",
      text: "text-amber-600",
      iconBg: "bg-amber-100 text-amber-700",
    },
    rose: {
      bg: "bg-rose-50/70",
      border: "border-rose-100",
      text: "text-rose-600",
      iconBg: "bg-rose-100 text-rose-700",
    },
    purple: {
      bg: "bg-purple-50/70",
      border: "border-purple-100",
      text: "text-purple-600",
      iconBg: "bg-purple-100 text-purple-700",
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`bg-white rounded-2xl border ${scheme.border} p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between group`}
    >
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-2xl sm:text-3xl font-extrabold ${scheme.text} tracking-tight`}>
          {value ?? "0"}
        </p>
      </div>
      <div
        className={`w-11 h-11 rounded-2xl ${scheme.iconBg} flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
    </div>
  );
}
