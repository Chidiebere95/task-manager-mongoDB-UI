import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
const EditTask = () => {
  const { pathname } = useLocation();
  const [taskID, setTaskID] = useState(pathname.slice(11));
  const [showEditStatus, setShowEditStatus] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [task, setTask] = useState({ name: '', completed: false, _id: '' });
//   console.log(task);
  const handleTaskEdit = (e) => {
    const { name, type } = e.target;
    const value = e.target.type === 'text' ? e.target.value : e.target.checked;
    if (type === 'text') {
      setTask({ ...task, [name]: value });
    } else if (type === 'checkbox') {
      setTask({ ...task, [name]: value }); 
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // console.log('edit');
    try {
        // console.log(task);
      await axios.patch(`http://localhost:4000/api/v1/tasks/${taskID}`, task);
      console.log('patch success');
      setShowEditStatus(true);
      setEditStatus('success');
      setTimeout(() => {
        setShowEditStatus(false);
        setEditStatus('');
      }, 3000);
    } catch (error) {
        console.log('patch fail error',error);
      setShowEditStatus(true);
      setEditStatus('fail');
      setTimeout(() => {
        setShowEditStatus(false);
        setEditStatus('');
      }, 3000);
    }
  };
  useEffect(() => {
    const getTask = async () => {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/tasks/${taskID}`
      );
      // console.log(data);
      setTask(data);
    };
    getTask();
  }, []);
  return (
    <div className='container'>
      <form className='single-task-form'>
        <h4>Edit Task</h4>
        <div className='form-control'>
          <label>Task ID</label>
          <p className='task-edit-id'>{task._id}</p>
        </div>
        <div className='form-control'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            name='name'
            className='task-edit-name'
            value={task.name}
            onChange={(e) => handleTaskEdit(e)}
          />
        </div>
        <div className='form-control'>
          <label htmlFor='completed'>completed</label>
          <input
            type='checkbox'
            name='completed'
            className='task-edit-completed'
            checked={task.completed}
            onChange={(e) => handleTaskEdit(e)}
          />
        </div>
        <button
          onClick={(e) => handleFormSubmit(e)}
          type='submit'
          className='block btn task-edit-btn'
        >
          edit
        </button>
        {/* <div className='edit-status'>Edit sucessful</div> */}
        {showEditStatus && (
          <div
            className={`form-alert ${
              editStatus === 'success' ? 'text-success' : 'text-danger'
            }`}
          >
            {editStatus === 'success' ? ' Edit sucessful' : 'Edit failed'}
          </div>
        )}
      </form>
      <Link to='/' className='btn back-link'>
        back to tasks
      </Link>
    </div>
  );
};

export default EditTask;
