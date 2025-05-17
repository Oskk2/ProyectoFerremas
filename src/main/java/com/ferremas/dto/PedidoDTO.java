package com.ferremas.dto;

import java.util.List;

import com.ferremas.model.DetallePedido;
import com.ferremas.model.Pedido;

public class PedidoDTO {
    private Pedido pedido;
    private List<DetallePedido> detalles;

    public PedidoDTO() {
    }

    public PedidoDTO(Pedido pedido, List<DetallePedido> detalles) {
        this.pedido = pedido;
        this.detalles = detalles;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public List<DetallePedido> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }
}

