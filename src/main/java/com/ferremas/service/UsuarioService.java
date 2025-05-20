package com.ferremas.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ferremas.model.Usuario;
import com.ferremas.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;


    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Usuario registrar(Usuario usuario) {

        String passwordEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordEncriptada);

        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> login(String email, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isPresent()) {
            String passwordGuardada = usuarioOpt.get().getPassword();
            if (passwordEncoder.matches(password, passwordGuardada)) {
                return usuarioOpt;
            }
        }
        return Optional.empty();
    }

    public List<Usuario> obtenerTodos() {
    return usuarioRepository.findAll();
    }

    public Usuario actualizar(Long id, Usuario usuarioNuevo) {
        Usuario existente = usuarioRepository.findById(id).orElse(null);
        if (existente != null) {
            existente.setNombre(usuarioNuevo.getNombre());
            existente.setEmail(usuarioNuevo.getEmail());
            return usuarioRepository.save(existente);
        }
        return null;
    }

    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

}
