document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector("#tabla-usuarios tbody");

  async function cargarUsuarios() {
    try {
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const usuarios = await res.json();
      tabla.innerHTML = "";
      usuarios.forEach(u => {
        tabla.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${u.id}</td>
            <td contenteditable="true" onblur="guardarCampo(${u.id}, 'nombre', this.textContent)">${u.nombre}</td>
            <td contenteditable="true" onblur="guardarCampo(${u.id}, 'email', this.textContent)">${u.email}</td>
            <td>
              <select onchange="guardarCampo(${u.id}, 'rol', this.value)">
                <option value="cliente" ${u.rol === 'cliente' ? 'selected' : ''}>cliente</option>
                <option value="admin" ${u.rol === 'admin' ? 'selected' : ''}>admin</option>
              </select>
            </td>
            <td><button onclick="eliminarUsuario(${u.id})">🗑️</button></td>
          </tr>`);
      });
    } catch (err) {
      alert("Error al cargar usuarios.");
      console.error(err);
    }
  }

  window.guardarCampo = async (id, campo, valor) => {
    const body = { [campo]: valor.trim() };
    try {
      await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      alert("Campo actualizado.");
    } catch (err) {
      alert("Error al actualizar campo.");
      console.error(err);
    }
  };

  window.eliminarUsuario = async (id) => {
    if (confirm("¿Eliminar este usuario?")) {
      try {
        await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        await cargarUsuarios();
        alert("Usuario eliminado.");
      } catch (err) {
        alert("Error al eliminar usuario.");
        console.error(err);
      }
    }
  };

  cargarUsuarios();
});
