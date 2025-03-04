// src/components/books/BookForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookService from '../../services/api';
import './BookForm.css';

const BookForm = () => {
  const initialFormState = {
    title: '',
    author: '',
    isbn: '',
    description: '',
    publisher: '',
    publishYear: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const book = await bookService.getBookById(id);
      // Format publishYear as string for the form input
      const formattedBook = {
        ...book,
        publishYear: book.publishYear ? book.publishYear.toString() : ''
      };
      setFormData(formattedBook);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book data.');
      setLoading(false);
      navigate('/books');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!/^(?:[0-9]{10}|[0-9]{13})$/.test(formData.isbn)) {
      newErrors.isbn = 'ISBN must be either 10 or 13 digits';
    }
    
    if (formData.publishYear && !/^\d{4}$/.test(formData.publishYear)) {
      newErrors.publishYear = 'Publish year must be a 4-digit number';
    }
    
    if (!formData.totalCopies || formData.totalCopies < 1) {
      newErrors.totalCopies = 'Total copies must be at least 1';
    }
    
    if (formData.availableCopies === undefined || formData.availableCopies < 0) {
      newErrors.availableCopies = 'Available copies must be at least 0';
    } else if (parseInt(formData.availableCopies) > parseInt(formData.totalCopies)) {
      newErrors.availableCopies = 'Available copies cannot exceed total copies';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert string values to appropriate types
    const processedData = {
      ...formData,
      publishYear: formData.publishYear ? parseInt(formData.publishYear) : null,
      totalCopies: parseInt(formData.totalCopies),
      availableCopies: parseInt(formData.availableCopies)
    };
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form.');
      return;
    }
    
    try {
      setLoading(true);
      if (isEditMode) {
        await bookService.updateBook(id, processedData);
        toast.success('Book updated successfully!');
      } else {
        await bookService.createBook(processedData);
        toast.success('Book added successfully!');
      }
      navigate('/books');
    } catch (error) {
      console.error('Error saving book:', error);
      
      // Handle validation errors from the server
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(`Failed to ${isEditMode ? 'update' : 'add'} book. Please try again.`);
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="book-form-container">
      <h1>{isEditMode ? 'Edit Book' : 'Add New Book'}</h1>
      
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="author">Author*</label>
            <input
              type="text"
              id="author"
              name="author"
              className={`form-control ${errors.author ? 'is-invalid' : ''}`}
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
            />
            {errors.author && <div className="error-message">{errors.author}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="isbn">ISBN*</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter 10 or 13 digit ISBN"
            />
            {errors.isbn && <div className="error-message">{errors.isbn}</div>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Additional Details</h3>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter book category (e.g., Fiction, Science)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              className="form-control"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Enter publisher name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="publishYear">Publish Year</label>
            <input
              type="text"
              id="publishYear"
              name="publishYear"
              className={`form-control ${errors.publishYear ? 'is-invalid' : ''}`}
              value={formData.publishYear}
              onChange={handleChange}
              placeholder="Enter 4-digit year (e.g., 2023)"
            />
            {errors.publishYear && <div className="error-message">{errors.publishYear}</div>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Inventory Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalCopies">Total Copies*</label>
              <input
                type="number"
                id="totalCopies"
                name="totalCopies"
                className={`form-control ${errors.totalCopies ? 'is-invalid' : ''}`}
                value={formData.totalCopies}
                onChange={handleChange}
                min="1"
              />
              {errors.totalCopies && <div className="error-message">{errors.totalCopies}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="availableCopies">Available Copies*</label>
              <input
                type="number"
                id="availableCopies"
                name="availableCopies"
                className={`form-control ${errors.availableCopies ? 'is-invalid' : ''}`}
                value={formData.availableCopies}
                onChange={handleChange}
                min="0"
              />
              {errors.availableCopies && <div className="error-message">{errors.availableCopies}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Description</h3>
          
          <div className="form-group">
            <label htmlFor="description">Book Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Enter book description"
            ></textarea>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Book' : 'Add Book')}
          </button>
          <Link to="/books" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default BookForm;