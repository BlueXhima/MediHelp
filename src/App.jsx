import { useState } from 'react'
import ProtectedRoute from './ProtectedRoutes/protectedroutes';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

import LandingPage from './Guest/landingpage';
import Login from './Guest/Authentication/login';
import Register from './Guest/Authentication/register';

// Ito yung main file ng frontend, 
// dito siya magrurun, 
// dito rin yung mga routes ng frontend

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* Ito yung Routes ng Guest or Public */}
        <Route path="/" element={<Navigate to="/landingpage" replace/>}/>
        <Route path="/landingpage" element={<LandingPage/>}/>

        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        {/* Ito yung Routes ng Protected or Private */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
