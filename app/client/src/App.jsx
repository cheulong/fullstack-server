import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetchTasks();
    
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
      <h1>Tasks</h1>
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
    </>
  )
}

export default App
