// import { Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';

function App() {
  return (
    <div className="App">
    <Routes>
     <Route exact path='/' element={<Homepage />}></Route>
     <Route exact path='/chats' element={<Chatpage />}></Route>
    </Routes>

    </div>
  );
}

export default App;
