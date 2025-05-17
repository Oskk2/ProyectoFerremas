document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formProducto");
  const tabla = document.querySelector("#tabla-productos tbody");
  const boton = form.querySelector("button[type=submit]");

  async function cargarProductos() {
    try {
      const res = await fetch("/api/productos");
      if (!res.ok) throw new Error("Error al obtener productos");
      const productos = await res.json();
      tabla.innerHTML = "";
      productos.forEach(prod => {
        tabla.insertAdjacentHTML("beforeend", 
          `<tr>
            <td>${prod.id}</td>
            <td>${prod.nombre}</td>
            <td>${prod.precio}</td>
            <td>${prod.stock}</td>
            <td>${prod.marca}</td>
            <td>${prod.categoria}</td>
            <td><img src="/img/${prod.imagen}" width="50" alt="${prod.nombre}"></td>
            <td>
              <button onclick="editarProducto(${prod.id})">✏️</button>
              <button onclick="eliminarProducto(${prod.id})">🗑️</button>
            </td>
          </tr>`);
      });
    } catch (err) {
      alert("Ocurrió un error al cargar productos.");
      console.error(err);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("producto-id").value;
    const producto = {
      nombre: document.getElementById("nombre").value.trim(),
      marca: document.getElementById("marca").value.trim(),
      codigo: document.getElementById("codigo").value.trim(),
      precio: parseFloat(document.getElementById("precio").value),
      stock: parseInt(document.getElementById("stock").value),
      categoria: document.getElementById("categoria").value.trim(),
      imagen: document.getElementById("imagen").value.trim()
    };

    if (!producto.nombre || isNaN(producto.precio) || isNaN(producto.stock)) {
      alert("Por favor completa correctamente todos los campos.");
      return;
    }

    const metodo = id ? "PUT" : "POST";
    const url = id ? `/api/productos/${id}` : "/api/productos";

    try {
      await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
      });

      form.reset();
      document.getElementById("producto-id").value = "";
      boton.textContent = "Guardar Producto";
      await cargarProductos();
      alert(id ? "Producto actualizado." : "Producto agregado.");
    } catch (err) {
      alert("Error al guardar el producto.");
      console.error(err);
    }
  });

  window.editarProducto = async (id) => {
    try {
      const res = await fetch(`/api/productos/${id}`);
      if (!res.ok) throw new Error("Producto no encontrado");
      const prod = await res.json();

      document.getElementById("producto-id").value = prod.id;
      document.getElementById("nombre").value = prod.nombre;
      document.getElementById("marca").value = prod.marca;
      document.getElementById("codigo").value = prod.codigo;
      document.getElementById("precio").value = prod.precio;
      document.getElementById("stock").value = prod.stock;
      document.getElementById("categoria").value = prod.categoria;
      document.getElementById("imagen").value = prod.imagen;

      boton.textContent = "Actualizar Producto";
    } catch (err) {
      alert("Error al cargar producto.");
      console.error(err);
    }
  };

  window.eliminarProducto = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await fetch(`/api/productos/${id}`, { method: "DELETE" });
        await cargarProductos();
        alert("Producto eliminado.");
      } catch (err) {
        alert("Error al eliminar producto.");
        console.error(err);
      }
    }
  };

  cargarProductos();
});
