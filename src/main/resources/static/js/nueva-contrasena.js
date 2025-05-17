document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nuevaContraForm");
  const nuevaInput = document.getElementById("nueva");
  const confirmarInput = document.getElementById("confirmar");
  const strengthBar = document.getElementById("passwordStrength");
  const confirmFeedback = document.getElementById("confirmFeedback");

  // Actualiza barra de fuerza en tiempo real
  nuevaInput.addEventListener("input", () => {
    const value = nuevaInput.value;
    let strength = 0;

    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/\d/.test(value)) strength += 1;

    switch(strength) {
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

  // Validar que las contraseñas coincidan al tipear en confirmar
  confirmarInput.addEventListener("input", () => {
    if (confirmarInput.value !== nuevaInput.value) {
      confirmarInput.classList.add("is-invalid");
      confirmFeedback.style.display = "block";
    } else {
      confirmarInput.classList.remove("is-invalid");
      confirmFeedback.style.display = "none";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nueva = nuevaInput.value;
    const confirmar = confirmarInput.value;
    const email = sessionStorage.getItem("correoRecuperacion");

    // Validar campos vacíos y requisitos mínimos
    if (!nueva) {
      mostrarMensaje("La contraseña no puede estar vacía", "danger");
      return;
    }
    if (nueva.length < 8) {
      mostrarMensaje("La contraseña debe tener al menos 8 caracteres", "danger");
      return;
    }
    if (!/[A-Z]/.test(nueva)) {
      mostrarMensaje("La contraseña debe contener al menos una letra mayúscula", "danger");
      return;
    }
    if (!/\d/.test(nueva)) {
      mostrarMensaje("La contraseña debe contener al menos un número", "danger");
      return;
    }
    if (nueva !== confirmar) {
      mostrarMensaje("Las contraseñas no coinciden", "danger");
      return;
    }

    const res = await fetch("/api/usuarios/resetear-contrasena", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nueva }),
    });

    const texto = await res.text();
    mostrarMensaje(texto, res.ok ? "success" : "danger");

    if (res.ok) {
      sessionStorage.clear();
      setTimeout(() => (window.location.href = "/"), 2000);
    }
  });

  function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById("mensaje");
    mensajeDiv.innerText = texto;
    mensajeDiv.className = `mt-3 text-center alert alert-${tipo}`;
  }
});
