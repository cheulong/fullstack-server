import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [hostname, setHostname] = useState("");
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetchTasks();
    fetch("/hostname") // Assuming React and API are served together
    .then((res) => res.json())
    .then((data) => setHostname(data.hostname))
    .catch((err) => console.error("Error fetching hostname:", err));
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/api/tasks');
    setTasks(response.data || []);
  };

  const addTask = async () => {
    await axios.post('http://localhost:5000/api/tasks', { name: task });
    setTask('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  return (
    <>
      <h1>{import.meta.env.MODE}</h1>
      <h1>Tasks</h1>
      <p>Secret {process.env.VITE_SECRET}</p>
      <p>First name: {import.meta.env?.VITE_FIRST_NAME || 'default firstname'} </p>
      <p>Last name: {import.meta.env?.VITE_LAST_NAME || 'default lastname'}</p>
      <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.name}</span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>Hostname: {process.env.VITE_HOSTNAME}</p>
      <p>Node name: {process.env.VITE_MY_NODE_NAME}</p>
      <p>{hostname || "Loading..."}</p>
    </>
  )
}

export default App
