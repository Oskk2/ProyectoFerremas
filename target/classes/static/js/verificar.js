document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("verificarForm");
  const mensaje = document.getElementById("mensaje");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const codigoIngresado = document.getElementById("codigo").value;
    const codigoGuardado = sessionStorage.getItem("codigoVerificacion");

    if (codigoIngresado === codigoGuardado) {
      mensaje.className = "alert alert-success mt-3 text-center";
      mensaje.textContent = "Código correcto. Redirigiendo...";
      mensaje.classList.remove("d-none");

      setTimeout(() => (window.location.href = "/nueva-contrasena"), 2000);
    } else {
      mensaje.className = "alert alert-danger mt-3 text-center";
      mensaje.textContent = "Código incorrecto";
      mensaje.classList.remove("d-none");
    }
  });
});
