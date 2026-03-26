import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './Dashboard.css';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../SideBar/SideBar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Add = () => {
 

  return (
    <>
      <Navbar />
      <Sidebar className="sidebar"/>
      <div className="dashboard-container">
        <div className="main-content">
          <div className="dashboard-cards">
            <Link to="/addmanager" >
              <div className="dashboard-card">
                <div className="card-content">
                  <h3>Manager</h3>
                </div>
              </div>
            </Link>
            <Link to="/addexecutive" >
              <div className="dashboard-card">
                <div className="card-content">
                  <h3>Executive</h3>
                </div>
              </div>
            </Link>
            <Link to="/addvendor" >
              <div className="dashboard-card">
                <div className="card-content">
                  <h3>vendor</h3>
                </div>
              </div>
            </Link>
            
            </div>
            
            </div>
          
        </div>
      
    </>
  );
};

export default Add;
