package com.ferremas.controller;

import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ferremas.model.Usuario;
import com.ferremas.repository.UsuarioRepository;
import com.ferremas.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/register")
    public ResponseEntity<String> registrar(@RequestBody Usuario usuario) {
        if (usuarioService.registrar(usuario) == null) {
            return ResponseEntity.badRequest().body("El correo ya está registrado");
        }
        return ResponseEntity.ok("Usuario registrado correctamente");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario, HttpSession session) {
        Optional<Usuario> encontrado = usuarioService.login(usuario.getEmail(), usuario.getPassword());

        if (encontrado.isPresent()) {
            session.setAttribute("usuario", usuario);
            session.setAttribute("usuario", encontrado.get());
            return ResponseEntity.ok(encontrado.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodos(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null || !"admin".equals(usuario.getRol())) {
            return ResponseEntity.status(403).body("Acceso denegado");
        }

        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Map<String, Object> campos) {
        Optional<Usuario> optUsuario = usuarioRepository.findById(id);
        if (optUsuario.isEmpty()) return ResponseEntity.notFound().build();

        Usuario u = optUsuario.get();

        if (campos.containsKey("nombre")) u.setNombre((String) campos.get("nombre"));
        if (campos.containsKey("email")) u.setEmail((String) campos.get("email"));
        if (campos.containsKey("rol")) {
            String rol = (String) campos.get("rol");
            if (rol.equals("cliente") || rol.equals("admin")) {
                u.setRol(rol);
            } else {
                return ResponseEntity.badRequest().body("Rol inválido");
            }
        }

        usuarioRepository.save(u);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null || !"admin".equals(usuario.getRol())) {
            return ResponseEntity.status(403).body("Acceso denegado");
        }

        usuarioService.eliminar(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return ResponseEntity.status(401).body("No autenticado");

        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/cambiar-contrasena")
    public ResponseEntity<String> cambiarContrasena(@RequestBody Map<String, String> datos, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return ResponseEntity.status(401).body("No has iniciado sesión");

        String actual = datos.get("actual");
        String nueva = datos.get("nueva");

        // Comprobación usando BCrypt
        if (!passwordEncoder.matches(actual, usuario.getPassword())) {
            return ResponseEntity.badRequest().body("Contraseña actual incorrecta");
        }

        // Guardar nueva contraseña cifrada
        usuario.setPassword(passwordEncoder.encode(nueva));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Sesión cerrada");
    }

    @PostMapping("/resetear-contrasena")
    public ResponseEntity<String> resetearContrasena(@RequestBody Map<String, String> datos) {
        String email = datos.get("email");
        String nueva = datos.get("nueva");

        Optional<Usuario> opt = usuarioRepository.findByEmail(email);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Usuario no encontrado");

        Usuario u = opt.get();
        u.setPassword(passwordEncoder.encode(nueva));
        usuarioRepository.save(u);

        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }



}
