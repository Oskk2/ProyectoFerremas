package com.ferremas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "correo", nullable = false, unique = true)
    @JsonProperty("email")
    private String email;

    @Column(name = "contrasena", nullable = false)
    @JsonProperty("password")
    private String password;

    @Column(name = "nombre_usuario", nullable = false)
    @JsonProperty("nombre")
    private String nombre;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "rol", nullable = false)
    private String rol;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public String getRol() {
    return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

}
