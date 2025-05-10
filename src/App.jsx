// src/App.jsx
import {BrowserRouter as Router, Routes, Route,} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ItemConfigurator from "./pages/ItemConfigurator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/configure/:itemId" element={<ItemConfigurator />} />
      </Routes>
    </Router>
  );
}

export default App;
