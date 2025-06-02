import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './component/header';
import Footer from './component/footer';
import Home from './component/Home';
import LandingPage from './component/landingPage';
import Mynotes from './component/Mynotes';

const App = () => {
  return (
    <div className="flex flex-col ">
      <Header />
      <main >
        <Routes>
          <Route path='/mynotes' element={<Mynotes />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div >
  );
};

export default App;
