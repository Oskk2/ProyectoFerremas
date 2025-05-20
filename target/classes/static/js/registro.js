document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const strengthBar = document.getElementById("passwordStrength");
  const confirmFeedback = document.getElementById("confirmFeedback");
  const mensajeDiv = document.getElementById("mensaje");

  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;
    let strength = 0;

    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/\d/.test(value)) strength += 1;

    switch (strength) {
      case 0:
        strengthBar.style.width = "0%";
        strengthBar.className = "progress-bar";
        break;
      case 1:
        strengthBar.style.width = "33%";
        strengthBar.className = "progress-bar bg-danger";
        break;
      case 2:
        strengthBar.style.width = "66%";
        strengthBar.className = "progress-bar bg-warning";
        break;
      case 3:
        strengthBar.style.width = "100%";
        strengthBar.className = "progress-bar bg-success";
        break;
    }
  });

  confirmInput.addEventListener("input", () => {
    if (confirmInput.value !== passwordInput.value) {
      confirmInput.classList.add("is-invalid");
      confirmFeedback.style.display = "block";
    } else {
      confirmInput.classList.remove("is-invalid");
      confirmFeedback.style.display = "none";
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarMensaje("Por favor ingresa un correo válido.", "danger");
      return;
    }

    if (!nombre) {
      mostrarMensaje("El nombre es obligatorio", "danger");
      return;
    }
    if (!email) {
      mostrarMensaje("El correo es obligatorio", "danger");
      return;
    }
    if (password.length < 8) {
      mostrarMensaje("La contraseña debe tener al menos 8 caracteres", "danger");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      mostrarMensaje("La contraseña debe contener al menos una letra mayúscula", "danger");
      return;
    }
    if (!/\d/.test(password)) {
      mostrarMensaje("La contraseña debe contener al menos un número", "danger");
      return;
    }
    if (password !== confirmPassword) {
      mostrarMensaje("Las contraseñas no coinciden", "danger");
      return;
    }

    const userData = { nombre, email, password, rol: "cliente" };

    try {
      const response = await fetch("/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al registrar usuario");
      }

      // Guardar sesión
      localStorage.setItem("usuario", JSON.stringify(userData));
      mostrarMensaje("Registro exitoso. Redirigiendo al login...", "success");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Error en el registro:", error);
      mostrarMensaje("Hubo un problema al registrar el usuario. El usuario ya existe.", "danger");
    }
  });

  function mostrarMensaje(texto, tipo) {
    mensajeDiv.innerText = texto;
    mensajeDiv.className = `mt-3 text-center alert alert-${tipo}`;
  }
});
