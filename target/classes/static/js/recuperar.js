emailjs.init("R7PoXI8GntxS-s81A");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recuperarForm");
  const mensaje = document.getElementById("mensaje");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const codigo = Math.floor(100000 + Math.random() * 900000);
    document.getElementById("codigo").value = codigo;

    sessionStorage.setItem("codigoVerificacion", codigo);
    sessionStorage.setItem("correoRecuperacion", correo);

    emailjs.sendForm("service_h4axwcn", "template_8pe4jti", form)
      .then(() => {
        mensaje.className = "alert alert-success mt-3 text-center";
        mensaje.textContent = "Código enviado a tu correo.";
        mensaje.classList.remove("d-none");

        setTimeout(() => (window.location.href = "/verificar"), 2000);
      })
      .catch((err) => {
        console.error("Error al enviar el correo:", err);
        mensaje.className = "alert alert-danger mt-3 text-center";
        mensaje.textContent = "Error al enviar el correo. Inténtalo más tarde.";
        mensaje.classList.remove("d-none");
      });
  });
});
