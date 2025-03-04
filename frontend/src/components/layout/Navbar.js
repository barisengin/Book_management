// src/components/layout/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-book"></i> Library Management System
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Books
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/books/new" className="nav-link btn-add">
              Add New Book
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;