package com.library.bookmanagement.service;

import com.library.bookmanagement.dto.BookDTO;
import com.library.bookmanagement.exception.BookNotFoundException;
import com.library.bookmanagement.exception.DuplicateIsbnException;
import com.library.bookmanagement.model.BookEntity;
import com.library.bookmanagement.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {
    
    private final BookRepository bookRepository;
    
    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
    
    public List<BookDTO.BookResponse> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::mapToBookResponse)
                .collect(Collectors.toList());
    }
    
    public BookDTO.BookResponse getBookById(Long id) {
        BookEntity book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        return mapToBookResponse(book);
    }
    
    public List<BookDTO.BookResponse> searchBooks(String searchTerm) {
        return bookRepository.searchBooks(searchTerm).stream()
                .map(this::mapToBookResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BookDTO.BookResponse createBook(BookDTO.BookRequest bookRequest) {
        // Check if ISBN already exists
        Optional<BookEntity> existingBook = bookRepository.findByIsbn(bookRequest.getIsbn());
        if (existingBook.isPresent()) {
            throw new DuplicateIsbnException("Book with ISBN " + bookRequest.getIsbn() + " already exists");
        }
        
        BookEntity book = mapToBookEntity(bookRequest);
        BookEntity savedBook = bookRepository.save(book);
        return mapToBookResponse(savedBook);
    }
    
    @Transactional
    public BookDTO.BookResponse updateBook(Long id, BookDTO.BookRequest bookRequest) {
        BookEntity existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        
        // Check if updating to an ISBN that already exists for another book
        if (bookRequest.getIsbn() != null && !bookRequest.getIsbn().equals(existingBook.getIsbn())) {
            Optional<BookEntity> bookWithSameIsbn = bookRepository.findByIsbn(bookRequest.getIsbn());
            if (bookWithSameIsbn.isPresent() && !bookWithSameIsbn.get().getId().equals(id)) {
                throw new DuplicateIsbnException("Book with ISBN " + bookRequest.getIsbn() + " already exists");
            }
        }
        
        // Update book properties
        updateBookFromRequest(existingBook, bookRequest);
        
        BookEntity updatedBook = bookRepository.save(existingBook);
        return mapToBookResponse(updatedBook);
    }
    
    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new BookNotFoundException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }
    
    private BookEntity mapToBookEntity(BookDTO.BookRequest bookRequest) {
        BookEntity book = new BookEntity();
        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setIsbn(bookRequest.getIsbn());
        book.setDescription(bookRequest.getDescription());
        book.setPublisher(bookRequest.getPublisher());
        book.setPublishYear(bookRequest.getPublishYear());
        book.setCategory(bookRequest.getCategory());
        book.setTotalCopies(bookRequest.getTotalCopies());
        book.setAvailableCopies(bookRequest.getAvailableCopies() != null ? 
                bookRequest.getAvailableCopies() : bookRequest.getTotalCopies());
        return book;
    }
    
    private void updateBookFromRequest(BookEntity book, BookDTO.BookRequest bookRequest) {
        if (bookRequest.getTitle() != null) {
            book.setTitle(bookRequest.getTitle());
        }
        if (bookRequest.getAuthor() != null) {
            book.setAuthor(bookRequest.getAuthor());
        }
        if (bookRequest.getIsbn() != null) {
            book.setIsbn(bookRequest.getIsbn());
        }
        if (bookRequest.getDescription() != null) {
            book.setDescription(bookRequest.getDescription());
        }
        if (bookRequest.getPublisher() != null) {
            book.setPublisher(bookRequest.getPublisher());
        }
        if (bookRequest.getPublishYear() != null) {
            book.setPublishYear(bookRequest.getPublishYear());
        }
        if (bookRequest.getCategory() != null) {
            book.setCategory(bookRequest.getCategory());
        }
        if (bookRequest.getTotalCopies() != null) {
            book.setTotalCopies(bookRequest.getTotalCopies());
        }
        if (bookRequest.getAvailableCopies() != null) {
            book.setAvailableCopies(bookRequest.getAvailableCopies());
        }
    }
    
    private BookDTO.BookResponse mapToBookResponse(BookEntity book) {
        return new BookDTO.BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getDescription(),
                book.getPublisher(),
                book.getPublishYear(),
                book.getCategory(),
                book.getTotalCopies(),
                book.getAvailableCopies(),
                book.getCreatedAt(),
                book.getUpdatedAt()
        );
    }
}