// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Auth from './components/Auth';
// import Chat from './components/Chat';

// function App() {
//   // Check if token exists in storage
//   const isAuth = !!localStorage.getItem('token');

//   return (
//     <Router>
//       <Routes>
//         {/* If logged in, go to chat. If not, show the Auth (Signup/Login) page */}
//         <Route path="/" element={isAuth ? <Navigate to="/chat" /> : <Auth />} />
        
//         {/* Explicit Login Route */}
//         <Route path="/login" element={isAuth ? <Navigate to="/chat" /> : <Auth />} />
        
//         {/* Protected Chat Route */}
//         <Route path="/chat" element={isAuth ? <Chat /> : <Navigate to="/login" />} />
        
//         {/* Catch-all: redirect to home */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ApolloProvider } from '@apollo/client/react'; // Import Provider
// import { client } from './apollo'; // Import the client we just created
// import Auth from './components/Auth';
// import Chat from './components/Chat';

// function App() {
//   // Check if token exists in storage
//   const isAuth = !!localStorage.getItem('token');

//   return (
//     <ApolloProvider client={client}>
//       <Router>
//         <Routes>
//           {/* If logged in, go to chat. If not, show the Auth page */}
//           <Route path="/" element={isAuth ? <Navigate to="/chat" /> : <Auth />} />
          
//           {/* Explicit Login Route */}
//           <Route path="/login" element={isAuth ? <Navigate to="/chat" /> : <Auth />} />
          
//           {/* Protected Chat Route */}
//           <Route path="/chat" element={isAuth ? <Chat /> : <Navigate to="/login" />} />
          
//           {/* Catch-all: redirect to home */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     </ApolloProvider>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./apollo";
import Auth from "./components/Auth";
import Chat from "./components/Chat";

function App() {
  // Check if token exists in localStorage
  const isAuth = Boolean(localStorage.getItem("token"));

  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={isAuth ? <Navigate to="/chat" replace /> : <Auth />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={isAuth ? <Navigate to="/chat" replace /> : <Auth />}
          />

          {/* Protected Chat Route */}
          <Route
            path="/chat"
            element={isAuth ? <Chat /> : <Navigate to="/login" replace />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
