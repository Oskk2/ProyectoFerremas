package com.ferremas.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ferremas.model.Product;
import com.ferremas.service.ProductService;

@Controller
public class CarritoWebController {

    @Autowired
    private ProductService productService;

    @GetMapping("/carrito")
    public String verCarrito(HttpSession session, Model model) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> carrito = (List<Map<String, Object>>) session.getAttribute("carrito");

        if (carrito == null) {
            carrito = new ArrayList<>();
        }

        double total = carrito.stream()
            .mapToDouble(item -> {
                Object precioObj = item.get("precio");
                Object cantidadObj = item.get("cantidad");
                double precio = precioObj instanceof Number ? ((Number) precioObj).doubleValue() : 0;
                int cantidad = cantidadObj instanceof Number ? ((Number) cantidadObj).intValue() : 0;
                return precio * cantidad;
            })
            .sum();

        model.addAttribute("carrito", carrito);
        model.addAttribute("total", total);

        return "carrito";
    }

    @PostMapping("/carrito/agregar")
    public String agregarAlCarrito(@RequestParam("id") Long id, HttpSession session) {
        Product producto = productService.getAllProducts().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (producto == null) {
            return "redirect:/productos";
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> carrito = (List<Map<String, Object>>) session.getAttribute("carrito");

        if (carrito == null) {
            carrito = new ArrayList<>();
            session.setAttribute("carrito", carrito);
        }

        boolean encontrado = false;

        for (Map<String, Object> item : carrito) {
            if (item.get("id").equals(producto.getId())) {
                int cantidad = (int) item.get("cantidad");
                item.put("cantidad", cantidad + 1);
                encontrado = true;
                break;
            }
        }

        if (!encontrado) {
            Map<String, Object> nuevoItem = new HashMap<>();
            nuevoItem.put("id", producto.getId());
            nuevoItem.put("nombre", producto.getNombre());
            nuevoItem.put("precio", producto.getPrecio());
            nuevoItem.put("cantidad", 1);
            nuevoItem.put("imagen", producto.getImagen());
            carrito.add(nuevoItem);
        }

        return "redirect:/productos";
    }

    @PostMapping("/carrito/eliminar")
    public String eliminarDelCarrito(@RequestParam("id") Long idProducto, HttpSession session) {
    @SuppressWarnings("unchecked")
    List<Map<String, Object>> carrito = (List<Map<String, Object>>) session.getAttribute("carrito");

    if (carrito != null) {
        carrito.removeIf(item -> item.get("id").equals(idProducto));
    }

    return "redirect:/carrito";
    }

    @GetMapping("/api/carrito")
    @ResponseBody
    public List<Map<String, Object>> obtenerCarritoJson(HttpSession session) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> carrito = (List<Map<String, Object>>) session.getAttribute("carrito");
        
        if (carrito == null) {
            return new ArrayList<>();
        }

        // Enriquecer con datos del producto como la imagen
        List<Map<String, Object>> carritoConImagen = new ArrayList<>();
        for (Map<String, Object> item : carrito) {
            Long id = (Long) item.get("id");
            Product producto = productService.getAllProducts().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElse(null);
            
            if (producto != null) {
                Map<String, Object> nuevoItem = new HashMap<>(item);
                nuevoItem.put("imagen", producto.getImagen());
                carritoConImagen.add(nuevoItem);
            }
        }

        return carritoConImagen;
    }

    @PostMapping("/carrito/modificar")
    @ResponseBody
    public Map<String, Object> modificarCantidad(
            @RequestParam("id") Long id,
            @RequestParam("cambio") int cambio,
            HttpSession session) {

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> carrito = (List<Map<String, Object>>) session.getAttribute("carrito");

        if (carrito == null) {
            carrito = new ArrayList<>();
        }

        double subtotalProducto = 0;
        double totalGlobal;

        for (int i = 0; i < carrito.size(); i++) {
            Map<String, Object> item = carrito.get(i);
            if (item.get("id").equals(id)) {
                int cantidad = (int) item.get("cantidad");
                int nuevaCantidad = cantidad + cambio;

                if (nuevaCantidad <= 0) {
                    carrito.remove(i);
                } else {
                    item.put("cantidad", nuevaCantidad);
                    double precio = ((Number) item.get("precio")).doubleValue();
                    subtotalProducto = precio * nuevaCantidad;
                }
                break;
            }
        }

        // Calcular total del carrito
        totalGlobal = carrito.stream()
                .mapToDouble(item -> ((Number) item.get("precio")).doubleValue() * (int) item.get("cantidad"))
                .sum();

        session.setAttribute("carrito", carrito);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("subtotal", subtotalProducto);
        respuesta.put("total", totalGlobal);

        return respuesta;
    }

    @PostMapping("/pago-compra")
    public String procesarPago(@RequestParam double total, Model model) {
        model.addAttribute("total", total);
        return "pago-compra";
    }
}
