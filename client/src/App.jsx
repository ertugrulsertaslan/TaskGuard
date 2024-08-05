import "./App.css";
import { Link } from "react-router-dom";
function App() {
  return (
    <>
      <h2>HomePage</h2>
      <div>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/tasks">Tasks</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </>
  );
}

export default App;
