package com.ferremas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferremas.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoriaIgnoreCase(String categoria);
}
