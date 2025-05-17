package com.ferremas.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ferremas.dto.PedidoDTO;
import com.ferremas.dto.PedidoRequestDTO;
import com.ferremas.model.DetallePedido;
import com.ferremas.model.Pedido;
import com.ferremas.model.Product;
import com.ferremas.model.Usuario;
import com.ferremas.repository.DetallePedidoRepository;
import com.ferremas.repository.PedidoRepository;
import com.ferremas.repository.ProductRepository;
import com.ferremas.repository.UsuarioRepository;



@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<PedidoDTO>> obtenerPedidosPorUsuario(@PathVariable Long id) {
        List<Pedido> pedidos = pedidoRepository.findByUsuario_Id(id);
        List<PedidoDTO> pedidosDTO = new ArrayList<>();

        for (Pedido pedido : pedidos) {
            List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());
            pedidosDTO.add(new PedidoDTO(pedido, detalles));
        }

        return ResponseEntity.ok(pedidosDTO);
    }

    @PostMapping("/crear")
    public ResponseEntity<String> crearPedido(@RequestBody PedidoRequestDTO pedidoDTO) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(pedidoDTO.idUsuario);
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuarioOpt.get());
        pedido.setEstado("Pagado");
        pedido.setTotal(pedidoDTO.total);
        pedido = pedidoRepository.save(pedido);

        for (PedidoRequestDTO.DetalleRequestDTO detalleDTO : pedidoDTO.detalles) {
            Optional<Product> productoOpt = productRepository.findById(detalleDTO.idProducto);
            if (!productoOpt.isPresent()) continue;

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProduct(productoOpt.get());
            detalle.setCantidad(detalleDTO.cantidad);
            detalle.setPrecioUnitario(detalleDTO.precioUnitario);
            detallePedidoRepository.save(detalle);

            // Actualiza el stock del producto
            Product p = productoOpt.get();
            p.setStock(p.getStock() - detalleDTO.cantidad);
            productRepository.save(p);
        }

        return ResponseEntity.ok("Pedido creado con éxito");
    }

    @GetMapping("/todos")
    public ResponseEntity<List<PedidoDTO>> obtenerTodosLosPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        List<PedidoDTO> pedidosDTO = new ArrayList<>();

        for (Pedido pedido : pedidos) {
            List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());
            pedidosDTO.add(new PedidoDTO(pedido, detalles));
        }

        return ResponseEntity.ok(pedidosDTO);
    }

}

