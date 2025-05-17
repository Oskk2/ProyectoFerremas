package com.ferremas.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferremas.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario_Id(Long idUsuario); 

}
