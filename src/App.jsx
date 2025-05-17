// src/App.jsx
import {BrowserRouter as Router, Routes, Route,} from "react-router-dom";

import HomePage from "./pages/HomePage";
import BackOfficeHome from "./pages/BackOfficeHome";
import ItemForm from "./pages/ItemForm";
import ItemPartForm from "./pages/ItemPartForm";
import ItemConfigurator from "./pages/ItemConfigurator";
import CheckoutPage from "./pages/CheckoutPage";  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/configure/:itemId" element={<ItemConfigurator />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/backoffice" element={<BackOfficeHome />} />
        <Route path="/backoffice/items/new" element={<ItemForm mode="create" />} />
        <Route path="/backoffice/items/:itemId/edit" element={<ItemForm mode="edit" />} />
        <Route path="/backoffice/items/:itemId/parts/new" element={<ItemPartForm mode="create" />} />
        <Route path="/backoffice/items/:itemId/parts/:itemPartId/edit" element={<ItemPartForm mode="edit" />} />
        
      </Routes>
    </Router>
  );
}

export default App;
