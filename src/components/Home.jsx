import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

import '../App.css';
import { Link } from 'react-router-dom';

function Home() {
  const [allTasksContent, setAllTasksContent] = useState([]);
  const [task, setTask] = useState({name:''});
  const loadingDomContainer = useRef(null);
  const tasksDomContainer = useRef(null);
  const handleTaskDelete = async (id) => {
    const { data } = await axios.delete(
      `http://localhost:4000/api/v1/tasks/${id}`
    );
    console.log(data);
    showTasks();
  };
  const showTasks = async () => {
    loadingDomContainer.current.style.visibility = 'visible';
    console.log('before try');
    try {
      console.log('inside try');
      const { data } = await axios.get('http://localhost:4000/api/v1/tasks');
      console.log(data);
      if (data.length < 1) {
        tasksDomContainer.current.innerHTML =
          '<h5 class="empty-list">No tasks in your list</h5>';
        loadingDomContainer.current.style.visibility = 'hidden';
        return;
      }
      setAllTasksContent(data);
    } catch (error) {
      tasksDomContainer.current.innerHTML =
        '<h5 class="empty-list">There was an error, please try later....</h5>';
    }
    loadingDomContainer.current.style.visibility = 'hidden';
  };
  useEffect(() => {
    showTasks();
  }, []);
  // Load tasks from /api/tasks

  return (
    <div className='App'>
      <form className='task-form'>
        <h4>task manager</h4>
        <div className='form-control'>
          <input
            type='text'
            name='name'
            className='task-input'
            placeholder='e.g. wash dishes'
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
          />
          <button
            onClick={async (e) => {
                e.preventDefault()
              try {
                const { data } = await axios.post(
                  'http://localhost:4000/api/v1/tasks',
                  task
                );
                console.log(data);
              } catch (error) {
                console.log(error);
              }
            }}
            type='submit'
            className='btn submit-btn'
          >
            submit
          </button>
        </div>
        <div className='form-alert'></div>
      </form>
      <section className='tasks-container'>
        <p ref={loadingDomContainer} className='loading-text'>
          Loading...
        </p>
        <div ref={tasksDomContainer} className='tasks'>
          {allTasksContent.length > 0 &&
            allTasksContent.map((item,index) => {
              const { completed, name, _id: taskID } = item;
              return (
                <div key={index} className={`single-task ${completed && 'task-completed'}`}>
                  <h5>
                    <span className='check-circle'>
                      <FaCheck/>
                    </span>
                    {name}
                  </h5>

                  <div className='task-links'>
                    <div className='edit-link'>
                      <Link to={`edit-task/${taskID}`}>
                        <FaEdit />
                      </Link>
                    </div>
                    <button
                      type='button'
                      className='delete-btn'
                      data-id='${taskID}'
                      onClick={() => handleTaskDelete(taskID)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

export default Home;
