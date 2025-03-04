// src/components/books/BookList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookService from '../../services/api';
import BookCard from './BookCard';
import SearchBar from './SearchBar';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    try {
      setLoading(true);
      if (term.trim() === '') {
        fetchBooks();
      } else {
        const results = await bookService.searchBooks(term);
        setBooks(results);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error searching books:', error);
      toast.error('Failed to search books. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        setBooks(books.filter(book => book.id !== id));
        toast.success('Book deleted successfully!');
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book. Please try again.');
      }
    }
  };

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h1>Book Management</h1>
        <Link to="/books/new" className="btn btn-success">
          Add New Book
        </Link>
      </div>

      <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="no-books">
          {searchTerm ? (
            <p>No books found matching your search criteria.</p>
          ) : (
            <p>No books available. Add a new book to get started.</p>
          )}
        </div>
      ) : (
        <div className="book-grid">
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onDelete={() => handleDelete(book.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;