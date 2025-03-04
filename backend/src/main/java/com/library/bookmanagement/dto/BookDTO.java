package com.library.bookmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class BookDTO {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookRequest {
        @NotBlank(message = "Title is required")
        private String title;
        
        @NotBlank(message = "Author is required")
        private String author;
        
        @Pattern(regexp = "^(?:[0-9]{10}|[0-9]{13})$", message = "ISBN must be 10 or 13 digits")
        private String isbn;
        
        private String description;
        
        private String publisher;
        
        private Integer publishYear;
        
        private String category;
        
        @Positive(message = "Total copies must be positive")
        private Integer totalCopies;
        
        @PositiveOrZero(message = "Available copies must be non-negative")
        private Integer availableCopies;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookResponse {
        private Long id;
        private String title;
        private String author;
        private String isbn;
        private String description;
        private String publisher;
        private Integer publishYear;
        private String category;
        private Integer totalCopies;
        private Integer availableCopies;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}