package com.ferremas.dto;

import java.math.BigDecimal;
import java.util.List;

public class PedidoRequestDTO {
    public Long idUsuario;
    public BigDecimal total;
    public List<DetalleRequestDTO> detalles;

    public static class DetalleRequestDTO {
        public Long idProducto;
        public int cantidad;
        public BigDecimal precioUnitario;
    }
}
