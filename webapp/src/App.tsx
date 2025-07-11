import User from './pages/User';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from './pages/AdminPanel';

function App() {

  return (
    <> 
      <Router>
      <div className="App">
        <Routes>
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>   
    </>
  );
}

export default App
