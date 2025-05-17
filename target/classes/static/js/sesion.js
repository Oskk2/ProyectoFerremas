document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("botonLoginLogout");
  if (!btn) return;

  const usuarioLogeado = localStorage.getItem("usuario");

  if (usuarioLogeado) {
    const usuario = JSON.parse(usuarioLogeado);
    btn.textContent = `Cerrar sesión (${usuario.nombre})`;
    btn.classList.remove("btn-outline-primary");
    btn.classList.add("btn-danger");

    btn.onclick = () => {
      if (usuario && usuario.email) {
        localStorage.removeItem(`carrito_${usuario.email}`);
      }
      localStorage.removeItem("usuario");
      window.location.href = "/";
    };

    // Agregar botón "Mi Perfil"
    const nav = document.querySelector(".navbar-nav");
    const cerrarSesionBtn = document.getElementById("cerrarSesion");
    if (nav && cerrarSesionBtn) {
      const perfilBtn = document.createElement("li");
      perfilBtn.className = "nav-item";
      perfilBtn.innerHTML = `<a class="nav-link btn btn-outline-success ms-2" href="/perfil">Mi Perfil</a>`;

      // Insertar después del botón "Cerrar sesión"
      cerrarSesionBtn.parentElement.insertAdjacentElement("afterend", perfilBtn);
    }

    // Botón "Panel Admin"
    if (usuario.rol === "admin") {
      const adminBtn = document.createElement("li");
      adminBtn.className = "nav-item";
      adminBtn.innerHTML = `<a class="nav-link btn btn-warning text-white ms-2" href="/admin">Panel Admin</a>`;
      nav.appendChild(adminBtn);
    }

  } else {
    btn.textContent = "Iniciar sesión";
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-outline-primary");
    btn.onclick = () => window.location.href = "/login";
  }
});
