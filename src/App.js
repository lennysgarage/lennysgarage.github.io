import './App.css';
import { Routes, Route } from "react-router-dom";
import Landing from './components/Landing'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </div>
  );
}

export default App;
