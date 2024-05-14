import { BrowserRouter, Routes, Route } from 'react-router-dom';




import './index.css';
import TripStream from './TripStream';
import CurrentLocation from './CurrentLocation';

function App() {
  return (
    <BrowserRouter>
          <Routes>
              <Route path='/' Component={CurrentLocation} />
              <Route path='/trip/' Component={TripStream} />
          </Routes>
    </BrowserRouter>
  );
}

export default App;