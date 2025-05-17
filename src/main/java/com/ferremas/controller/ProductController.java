package com.ferremas.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ferremas.model.Product;
import com.ferremas.model.Usuario;
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
    public ResponseEntity<?> guardar(@RequestBody Product product, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null || !"admin".equals(usuario.getRol())) {
            return ResponseEntity.status(403).body("Acceso denegado");
        }

        return ResponseEntity.ok(productService.guardar(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody Product product, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null || !"admin".equals(usuario.getRol())) {
            return ResponseEntity.status(403).body("Acceso denegado");
        }

        return ResponseEntity.ok(productService.modificar(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null || !"admin".equals(usuario.getRol())) {
            return ResponseEntity.status(403).body("Acceso denegado");
        }

        productService.eliminar(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public Product obtenerPorId(@PathVariable Long id) {
        return productService.getProductoById(id);
    }
}
