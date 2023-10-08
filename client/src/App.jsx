import { Routes, Route } from "react-router-dom";
import Forms from "./components/Forms";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Forms/>}/>
        <Route path="/:roomId" element={<Forms/>}/>
      </Routes>
    </div>
  ); 
}

export default App;
