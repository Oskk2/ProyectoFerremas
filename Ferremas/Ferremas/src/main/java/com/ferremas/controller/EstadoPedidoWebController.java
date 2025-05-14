package com.ferremas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class EstadoPedidoWebController {

    @GetMapping("/estado-pedido")
    public String mostrarFormulario() {
        return "estado-pedido";
    }

    @GetMapping(value = "/estado-pedido", params = "id")
    public String consultarEstado(@RequestParam Long id, Model model) {
        String estado = "Pendiente";
        if (id % 3 == 0) estado = "Completado";
        else if (id % 2 == 0) estado = "En Proceso";
        model.addAttribute("estado", estado);
        return "estado-pedido";
    }
}
