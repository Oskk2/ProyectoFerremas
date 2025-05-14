document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = { nombre, email, password };

    try {
      const response = await fetch("/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Error al registrar usuario");

      // Guardar sesión
      localStorage.setItem("usuario", JSON.stringify(userData));
      alert("Registro exitoso. Sesión iniciada automáticamente.");
      window.location.href = "/";
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un problema al registrar el usuario.");
    }
  });
});
