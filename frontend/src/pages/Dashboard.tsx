import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
};

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    if (!title.trim()) return;
    setAdding(true);
    try {
      await API.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } finally {
      setAdding(false);
    }
  };

  const deleteTask = async (id: string) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredTasks = tasks.filter((t) =>
    filter === "all" ? true : t.status === filter
  );

  const pending = tasks.filter((t) => t.status !== "completed").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Subtle background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Navbar */}
      <header className="relative border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Tasks", value: tasks.length, color: "text-white", bg: "bg-slate-800", border: "border-slate-700" },
            { label: "Pending", value: pending, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            { label: "Completed", value: completed, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-xl p-4 text-center`}>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-400 text-xs mt-1 font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Create task card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTask()}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200"
            />
            <button
              onClick={createTask}
              disabled={adding || !title.trim()}
              className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-all duration-200"
            >
              {adding ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
          {(["all", "pending", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                filter === f
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <svg className="animate-spin w-7 h-7 text-violet-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-slate-400 text-sm">Loading tasks...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">No {filter === "all" ? "" : filter} tasks yet.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`group bg-slate-900 border rounded-xl p-5 flex items-start justify-between gap-4 transition-all duration-200 hover:border-slate-600 ${
                  task.status === "completed"
                    ? "border-slate-800 opacity-75"
                    : "border-slate-700"
                }`}
              >
                {/* Left: content */}
                <div className="flex items-start gap-3 min-w-0">
                  {/* Status indicator dot */}
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${task.status === "completed" ? "bg-emerald-500" : "bg-amber-400"}`} />
                  <div className="min-w-0">
                    <h3 className={`font-semibold text-sm ${task.status === "completed" ? "line-through text-slate-500" : "text-white"}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{task.description}</p>
                    )}
                  </div>
                </div>

                {/* Right: badge + actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    task.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {task.status}
                  </span>

                  {task.status !== "completed" && (
                    <button
                      onClick={() => updateTaskStatus(task._id, "completed")}
                      title="Mark complete"
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={() => deleteTask(task._id)}
                    title="Delete task"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
