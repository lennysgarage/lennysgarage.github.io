import './App.css';
import { Routes, Route } from "react-router-dom";
import Landing from './components/Landing'
import Resume from './components/Resume';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  );
}

export default App;
