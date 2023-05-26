import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import EditTask from './components/EditTask';
function App(params) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/edit-task/:id' element={<EditTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
