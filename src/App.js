import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/appRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
