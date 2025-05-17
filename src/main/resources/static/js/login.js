document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const mensajeDiv = document.getElementById("mensaje");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Validar campos vacíos
    if (!email || !password) {
      mostrarMensaje("Por favor completa todos los campos.", "danger");
      return;
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarMensaje("Por favor ingresa un correo válido.", "danger");
      return;
    }

    try {
      const response = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          mostrarMensaje("El correo no existe.", "danger");
        } else if (response.status === 401) {
          mostrarMensaje("Contraseña incorrecta.", "danger");
        } else {
          mostrarMensaje("Correo o contraseña incorrecta.", "danger");
        }
        return;
      }

      const usuario = await response.json();

      // Guardar usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Cargar carrito asociado si existe
      const carritoGuardado = localStorage.getItem(`carrito_${usuario.email}`);
      if (carritoGuardado) {
        console.log("Carrito local cargado para:", usuario.email);
      }

      mostrarMensaje("Sesión iniciada correctamente", "success");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      mostrarMensaje("Error al conectar con el servidor.", "danger");
    }
  });

  function mostrarMensaje(texto, tipo) {
    mensajeDiv.innerText = texto;
    mensajeDiv.className = `mt-3 text-center alert alert-${tipo}`;
  }
});

