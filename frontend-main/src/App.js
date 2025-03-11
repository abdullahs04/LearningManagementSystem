import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import StudentOverview from './components/dashboard/StudentOverview';
import StudentSearch from './components/search/StudentSearch';
import StudentProfile from './components/student/StudentProfile';
import { students } from './data/mockData';

function App() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<StudentOverview />} />
          <Route 
            path="/search" 
            element={<StudentSearch students={students} setSelectedStudent={setSelectedStudent} />} 
          />
          <Route 
            path="/student/:id" 
            element={<StudentProfile students={students} />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <h1 className="text-3xl font-bold underline">
//           Hello world!
//         </h1>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
