document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const usuario = await response.json();

      // Guardar usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Cargar carrito asociado si existe
      const carritoGuardado = localStorage.getItem(`carrito_${usuario.email}`);
      if (carritoGuardado) {
        console.log("Carrito local cargado para:", usuario.email);
        // Opcional: podrías enviar este carrito al servidor si deseas sincronizar
      }

      alert("Sesión iniciada correctamente");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Correo o contraseña incorrecta.");
    }
  });
});
