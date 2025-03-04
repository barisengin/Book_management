package com.library.bookmanagement.repository;


import com.library.bookmanagement.model.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, Long> {
    
    Optional<BookEntity> findByIsbn(String isbn);
    
    List<BookEntity> findByTitleContainingIgnoreCase(String title);
    
    List<BookEntity> findByAuthorContainingIgnoreCase(String author);
    
    List<BookEntity> findByCategoryIgnoreCase(String category);
    
    @Query("SELECT b FROM BookEntity b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.publisher) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<BookEntity> searchBooks(@Param("searchTerm") String searchTerm);
}