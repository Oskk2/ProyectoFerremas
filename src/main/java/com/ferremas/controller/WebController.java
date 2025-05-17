package com.ferremas.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.ferremas.dto.PedidoDTO;
import com.ferremas.model.DetallePedido;
import com.ferremas.model.Pedido;
import com.ferremas.model.Product;
import com.ferremas.model.Usuario;
import com.ferremas.repository.DetallePedidoRepository;
import com.ferremas.repository.PedidoRepository;
import com.ferremas.service.ProductService;

@Controller
public class WebController {

    @Autowired
    private ProductService productService;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";  
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
    public String compra(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        
        if (usuario != null) {
            return "datos-entrega";
        } else {
            return "redirect:/login";
        }
    }

    
    @PostMapping("/procesar-entrega")
    public String procesarEntrega(
            @RequestParam String metodo_entrega,
            @RequestParam(required = false) String direccion,
            @RequestParam(required = false) String comuna,
            @RequestParam(required = false) String telefono,
            RedirectAttributes redirectAttributes) {

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

    @GetMapping("/admin")
    public String admin(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario != null && "admin".equals(usuario.getRol())) {
            return "admin";
        } else {
            return "redirect:/login";
        }
    }

    @GetMapping("/perfil")
    public String perfil(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario != null) {
            return "perfil";
        } else {
            return "redirect:/login";
        }
    }

    @GetMapping("/recuperar")
    public String vistaRecuperar() {
        return "recuperar";
    }

    @GetMapping("/verificar")
    public String vistaVerificar() {
        return "verificar";
    }

    @GetMapping("/nueva-contrasena")
    public String vistaNuevaContrasena() {
        return "nueva-contrasena";
    }

    @GetMapping("/pago-simulado")
    public String pagoSimulado() {

        return "pago-simulado";
    }

    @GetMapping("/mis-compras")
    public String mostrarCompras(Model model, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return "redirect:/login";
        }

        List<Pedido> pedidos = pedidoRepository.findByUsuario_Id(usuario.getId());
        List<PedidoDTO> pedidosDTO = new ArrayList<>();

        for (Pedido pedido : pedidos) {
            List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());
            pedidosDTO.add(new PedidoDTO(pedido, detalles));
        }

        model.addAttribute("pedidos", pedidosDTO);
        return "mis-compras";
    }

    @GetMapping("/gestion-historial")
    public String mostrarComprasUsuarios() {

        return "gestion-historial";
    }


}
