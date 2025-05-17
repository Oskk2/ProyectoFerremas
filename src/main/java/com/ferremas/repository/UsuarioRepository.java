package com.ferremas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ferremas.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmail(String email);
    Optional<Usuario> findByEmailAndPassword(String email, String password);
    Optional<Usuario> findByEmail(String email); 
}
