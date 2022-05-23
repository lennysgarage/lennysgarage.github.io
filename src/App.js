import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import Landing from './components/Landing'
import Resume from './components/Resume';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="resume" element={<Resume />} />
      </Routes>
    </div>
  );
}

export default App;
