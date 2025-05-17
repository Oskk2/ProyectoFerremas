package com.ferremas.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ferremas.model.Product;
import com.ferremas.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public List<Product> getProductsByCategoria(String categoria) {
        return repository.findByCategoriaIgnoreCase(categoria);
    }

    public Product getProductoById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Product guardar(Product product) {
        return repository.save(product); 
    }


    public Product modificar(Long id, Product modificarProduct) {
        Product existing = getProductoById(id);
        if (existing != null) {
            existing.setNombre(modificarProduct.getNombre());
            existing.setMarca(modificarProduct.getMarca());
            existing.setCodigo(modificarProduct.getCodigo());
            existing.setPrecio(modificarProduct.getPrecio());
            existing.setStock(modificarProduct.getStock());
            existing.setCategoria(modificarProduct.getCategoria());
            return repository.save(existing);
        }
        return null;
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }


}
