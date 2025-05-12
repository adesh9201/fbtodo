import React from 'react'; 
import Home from './pages/Home'; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  

function App() {   
  return (     
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-emerald-500 to-green-700 animate-gradient bg-[length:400%_400%]">
      <Home />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  ); 
}  

export default App;