import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Component/Routes/Routes";

function App() {
  return (
    <Router>
      <AppRoutes /> {/* Ye saare routes handle karega */}
    </Router>
  );
}

export default App;
