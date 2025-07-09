import User from './pages/User';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <> 
      <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<User />} />
        </Routes>
      </div>
    </Router>   
    </>
  );
}

export default App
