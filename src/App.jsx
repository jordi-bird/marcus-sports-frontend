import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ConfigureItem from './pages/ConfigureItem'; // ho farem després

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/configure/:itemId" element={<ConfigureItem />} />
      </Routes>
    </Router>
  );
}

export default App;
