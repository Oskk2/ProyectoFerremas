package com.ferremas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.ferremas.model.Product;
import com.ferremas.service.ProductService;

@Controller
public class WebController {

    @Autowired
    private ProductService productService;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";  
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin";  
    }

    @GetMapping("/registro")
    public String mostrarFormularioRegistro(Model model) {
        model.addAttribute("usuario", new com.ferremas.model.Usuario()); 
        return "registro";  
    }

    
    @GetMapping("/productos")
    public String verCatalogoCompleto(Model model) {
        List<Product> productos = productService.getAllProducts();
        model.addAttribute("productos", productos);
        return "productos";
    }


    @GetMapping("/productos/categoria/{categoria}")
    public String verPorCategoria(@PathVariable String categoria, Model model) {
        List<Product> productos = productService.getProductsByCategoria(categoria);
        model.addAttribute("productos", productos);
        model.addAttribute("categoria", categoria);
        return "productos";
    }

    @GetMapping("/datos-entrega")
    public String compra() {
        return "datos-entrega";  
    }

    
    @PostMapping("/procesar-entrega")
    public String procesarEntrega(
            @RequestParam String metodo_entrega,
            @RequestParam(required = false) String direccion,
            @RequestParam(required = false) String comuna,
            @RequestParam(required = false) String telefono,
            RedirectAttributes redirectAttributes) {

        // Aquí puedes guardar los datos en sesión, base de datos, etc.
        // Por ejemplo, para pasar datos a la siguiente vista:
        redirectAttributes.addFlashAttribute("metodoEntrega", metodo_entrega);
        redirectAttributes.addFlashAttribute("direccion", direccion);
        redirectAttributes.addFlashAttribute("comuna", comuna);
        redirectAttributes.addFlashAttribute("telefono", telefono);

        // Redirige a la página de confirmación
        return "redirect:/confirmar-pago";
    }

    @GetMapping("/confirmar-pago")
    public String pago() {
        return "confirmar-pago";  
    }

}
