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
      // Elimina carrito local del usuario logeado
      if (usuario && usuario.email) {
        localStorage.removeItem(`carrito_${usuario.email}`);
      }
      localStorage.removeItem("usuario");
      window.location.href = "/";
    };
  } else {
    btn.textContent = "Iniciar sesión";
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-outline-primary");
    btn.onclick = () => window.location.href = "/login";
  }
});
