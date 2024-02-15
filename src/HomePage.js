import React from 'react';
import Sidebar from './components/Sidebar.js'; // Import the Sidebar component
import Topbar from './components/Topbar.js'; // Assuming Topbar is also separated
import PipelineView from './components/PipelineView.js'; // And so is PipelineView

import './HomePage.css'; // Ensure you have corresponding CSS for styling

const HomePage = () => {
  return (
    <div className="home-page">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <PipelineView />
      </div>
    </div>
  );
};

export default HomePage;


