// src/components/books/BookCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book, onDelete }) => {
  const { id, title, author, isbn, category, availableCopies, totalCopies } = book;

  return (
    <div className="book-card">
      <div className="book-card-header">
        <h3 className="book-title">{title}</h3>
        {category && <span className="book-category">{category}</span>}
      </div>
      
      <div className="book-card-body">
        <p><strong>Author:</strong> {author}</p>
        <p><strong>ISBN:</strong> {isbn}</p>
        <p className="availability">
          <strong>Availability:</strong> {availableCopies} / {totalCopies}
          <span 
            className={`status-indicator ${
              availableCopies > 0 ? 'available' : 'unavailable'
            }`}
          />
        </p>
      </div>
      
      <div className="book-card-actions">
        <Link to={`/books/${id}`} className="btn btn-secondary btn-sm">
          View
        </Link>
        <Link to={`/books/edit/${id}`} className="btn btn-sm">
          Edit
        </Link>
        <button 
          className="btn btn-danger btn-sm" 
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;