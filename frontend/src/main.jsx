// // src/index.js
// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// import "./index.css";
// import { AuthProvider } from "./context/AuthContext.jsx";

// ReactDOM.render(
//   <React.StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

// ✅ Import Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      {/* ✅ ToastContainer at root level */}
      <ToastContainer
        position="top-right"
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
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
