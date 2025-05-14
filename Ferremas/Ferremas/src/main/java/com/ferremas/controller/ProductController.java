package com.ferremas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ferremas.model.Product;
import com.ferremas.service.ProductService;

@RestController
@RequestMapping("/api/productos")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product guardar(@RequestBody Product product) {
        return productService.guardar(product);
    }

    @PutMapping("/{id}")
    public Product modificar(@PathVariable Long id, @RequestBody Product product) {
        return productService.modificar(id, product);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        productService.eliminar(id);
    }

    @GetMapping("/{id}")
    public Product obtenerPorId(@PathVariable Long id) {
        return productService.getProductoById(id);
    }

}
