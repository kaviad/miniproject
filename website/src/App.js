import {HomePage} from "./Pages/HomePage";
import {LoginPage} from "./Pages/LoginPage";
import {UserPage} from "./Pages/UserPage";
import {AdminPage} from "./Pages/AdminPage";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/user" element={<UserPage/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
          <Route path="*" element={<h1>404 Not Found!</h1>}/>
        </Routes>
      </Router>

      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />

    </div>
  );
}

export default App;
