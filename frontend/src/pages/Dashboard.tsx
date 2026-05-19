import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

  const [tasks , setTasks] =useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await API.get("/tasks");
    setLoading(false);
    setTasks(data);
  }

  useEffect(() => { 
    fetchTasks();
  }, []);

  const createTask = async () => {
    await API.post("/tasks", {
      title,
      description,
    });

    setTitle("");
    setDescription("");

    fetchTasks();
  };

   const deleteTask = async (id: string) => {
    await API.delete(`/tasks/${id}`);

    fetchTasks();
  };

  const updateTaskStatus = async (
  id: string,
  status: string
) => {
  try {
    await API.put(`/tasks/${id}`, {
      status,
    });

    fetchTasks();

  } catch (error) {
    console.error(error);
  }
};


  return (
    <div>


      <h1>Dashboard</h1>

        <div className="max-w-3xl mx-auto p-6">
          {
  loading && (
    <p>Loading...</p>
  )
}

    {/* header */}

    {/* create task */}
     <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <button onClick={createTask}>
        Add Task
      </button>

      <hr />

    {/* tasks */}

    
      {
  tasks.map((task) => (
    <div
      key={task._id}
      className="bg-white p-4 rounded-lg shadow mb-4"
    >

      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-xl font-semibold">
            {task.title}
          </h3>

          <p className="text-gray-600">
            {task.description}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded text-white ${
            task.status === "completed"
              ? "bg-green-500"
              : "bg-yellow-500"
          }`}
        >
          {task.status}
        </span>

      </div>

      <div className="flex gap-3 mt-4">

        {
          task.status !== "completed" && (
            <button
              onClick={() =>
                updateTaskStatus(
                  task._id,
                  "completed"
                )
              }
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Complete
            </button>
          )
        }

        <button
          onClick={() =>
            deleteTask(task._id)
          }
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>

      </div>

    </div>
  ))
}

  </div>

      


      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.reload();
      }}>
        Logout
      </button>

    </div>
  )
}

export default Dashboard;