// src/components/books/BookDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookService from '../../services/api';
import './BookDetail.css';

const BookDetail = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookService.getBookById(id);
        setBook(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book details:', error);
        toast.error('Failed to load book details.');
        setLoading(false);
        // Redirect to book list on error
        navigate('/books');
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        toast.success('Book deleted successfully!');
        navigate('/books');
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (!book) {
    return <div className="error">Book not found.</div>;
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail-header">
        <h1>{book.title}</h1>
        <div className="action-buttons">
          <Link to={`/books/edit/${id}`} className="btn">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
          <Link to="/books" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>

      <div className="book-detail-content">
        <div className="book-info">
          <div className="info-group">
            <h3>General Information</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Category:</strong> {book.category || 'Not categorized'}</p>
            <p><strong>Publisher:</strong> {book.publisher || 'Not specified'}</p>
            <p><strong>Publish Year:</strong> {book.publishYear || 'Not specified'}</p>
          </div>

          <div className="info-group">
            <h3>Inventory</h3>
            <p><strong>Total Copies:</strong> {book.totalCopies}</p>
            <p><strong>Available Copies:</strong> {book.availableCopies}</p>
            <p><strong>Status:</strong> 
              <span className={`status ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
              </span>
            </p>
          </div>

          <div className="info-group">
            <h3>System Information</h3>
            <p><strong>Created:</strong> {new Date(book.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(book.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="book-description">
          <h3>Description</h3>
          <p>{book.description || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;