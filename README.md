/*Extensiones utilizadas y necesarias para el funcionamiento:*/

Extension Pack for Java

Spring Boot Extension Pack

Lombok Annotation Support for VS Code

/*Cambios en application.properites para MySQL:*/

spring.datasource.username=root
spring.datasource.password=(CONTRASEÑA DE MYSQL)

/*Base de datos utilizada: MySQL*/

DROP DATABASE IF EXISTS ferremas_db;
CREATE DATABASE ferremas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ferremas_db;

CREATE TABLE usuario (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    rol VARCHAR(20) NOT NULL
);

CREATE TABLE producto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    imagen VARCHAR(255) NOT NULL
);

CREATE TABLE carrito (
    id_carrito BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE detalle_carrito (
    id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_carrito BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id) ON DELETE CASCADE
);

CREATE TABLE pedido (
    id_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE factura (
    id_factura BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    fecha_emision DATETIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE
);

CREATE TABLE detalle_pedido (
    id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id) ON DELETE CASCADE
);

CREATE TABLE pago (
    id_pago BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE
);

INSERT INTO usuario (id_usuario, nombre_usuario, correo, contrasena, direccion, rol) VALUES
(1, 'ADMINISTRADOR', 'admin@gmail.com', '$2a$10$CS5liozGnxen4Vi8HgIY0OqfDezo8LRf4qvPxDTDR6d7kFzbJtqja', 'Comuna, calle 123', 'admin'),
(2, 'ADMINISTRADOR2', 'admin2@gmail.com', '$2a$10$CS5liozGnxen4Vi8HgIY0OqfDezo8LRf4qvPxDTDR6d7kFzbJtqja', 'Comuna, calle 123', 'admin');

INSERT INTO producto (id, nombre, marca, codigo, precio, stock, categoria, imagen) VALUES
(1, 'Taladro Percutor GSB 13 RE 127V', 'Bosch', 'BOS-67890', 83900.0, 10, 'Herramientas', 'H.taladro.jpg'),
(2, 'Martillo Mango de Fibra 16oz', 'Stanley', 'STA-11223', 9690.0, 25, 'Herramientas', 'H.martillo.jpg'),
(3, 'Llave Inglesa Ajustable 10\'\'', 'Truper', 'TRU-90112', 8990.0, 30, 'Herramientas', 'H.llave.jpg'),
(4, 'Destornillador de Precisión Set 6 Piezas', 'Pretul', 'PRE-44511', 4990.0, 20, 'Herramientas', 'H.destornillador.jpg'),
(5, 'Cemento Portland Gris 25kg', 'Polpaico', 'POL-12345', 3990.0, 50, 'Materiales', 'M.cemento.jpg'),
(6, 'Yeso Cartón ST 1.2x2.4m', 'Knauf', 'KNA-67321', 8990.0, 40, 'Materiales', 'M.yeso.jpg'),
(7, 'Arena Fina M3', 'Melón', 'MEL-21234', 28990.0, 15, 'Materiales', 'M.arena.jpg'),
(8, 'Grava 3/4 M3', 'Cemex', 'CEM-88991', 31990.0, 12, 'Materiales', 'M.grava.jpg'),
(9, 'Tornillo para Madera 8x1 1/2" 100un', 'Fixser', 'FIX-88121', 3490.0, 100, 'Materiales', 'M.tornillo.jpg'),
(10, 'Clavos de Acero 2" Caja 1kg', 'Truper', 'TRU-44213', 4290.0, 50, 'Materiales', 'M.clavo.jpg'),
(11, 'Tarugos Plásticos con Tornillo 6mm x 50un', 'Fischer', 'FIS-99111', 3590.0, 80, 'Materiales', 'M.tarugos.jpg'),
(12, 'Perno con Tuerca 3/8" x 2"', 'Mamut', 'MAM-55678', 590.0, 300, 'Materiales', 'M.perno.jpg'),
(13, 'Guantes Aislantes Clase 00', '3M', '3M-44567', 9890.0, 100, 'Electricidad', 'E.guantes.jpg'),
(14, 'Cinta Aisladora Profesional 18mmx20m', '3M', '3M-66789', 1590.0, 150, 'Electricidad', 'E.cinta.jpg'),
(15, 'Canaleta Plástica 20x10mm Blanca', 'Ingelec', 'ING-00012', 2090.0, 60, 'Electricidad', 'E.canaleta.jpg'),
(16, 'Interruptor Simple Empotrado Blanco', 'Bticino', 'BTI-44221', 2690.0, 40, 'Electricidad', 'E.interruptor.jpg'),
(17, 'Guantes Nitrilo Grip Trabajo Pesado', '3M', '3M-88991', 9890.0, 100, 'Seguridad', 'S.guantes.jpg'),
(18, 'Gafas de Seguridad Claras Antiempañantes', 'MSA', 'MSA-55901', 7490.0, 80, 'Seguridad', 'S.lentes.jpg'),
(19, 'Casco de Seguridad Blanco con Arnés', 'MSA', 'MSA-33412', 12990.0, 60, 'Seguridad', 'S.casco.jpg'),
(20, 'Protector Auditivo Tipo Copa', '3M', '3M-11289', 5990.0, 90, 'Seguridad', 'S.protectores.jpg'),
(21, 'Pintura Látex Extracubriente Blanca Galón', 'Sipa', 'SIP-33001', 20290.0, 15, 'Pinturas', 'P.latee.jpg'),
(22, 'Esmalte Sintético Brillante Rojo 1/4 Gal', 'Sherwin-Williams', 'SHW-44220', 9990.0, 10, 'Pinturas', 'P.esmalte.jpg'),
(23, 'Spray Acrílico Negro Mate 400ml', 'Rust-Oleum', 'ROS-88110', 5990.0, 25, 'Pinturas', 'P.acrilico.jpg'),
(24, 'Sellador para Madera Incoloro 1L', 'Kolor', 'KOL-22511', 7490.0, 12, 'Pinturas', 'P.sellador.jpg');
