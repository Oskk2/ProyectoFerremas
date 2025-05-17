document.addEventListener("DOMContentLoaded", () => {
  const total = localStorage.getItem("totalCompra") || 0;
  const numeroOrden = localStorage.getItem("numeroOrden") || "---";
  const moneda = localStorage.getItem("moneda") || "CLP";
  const tasas = { CLP: 1, USD: 1 / 943, EUR: 1 / 1052 };

  const mostrarTotal = document.getElementById("mostrar-total");
  const conversion = document.getElementById("conversion-total");
  const cuotaValor = document.getElementById("cuota-valor");

  document.getElementById("mostrar-orden").textContent = `Orden Nº: ${numeroOrden}`;
  mostrarTotal.textContent = `$${parseInt(total).toLocaleString("es-CL")} CLP`;

  let montoConvertido = parseInt(total) * tasas[moneda];
  if (moneda === "USD") conversion.textContent = `Total: $${montoConvertido.toFixed(2)} USD`;
  else if (moneda === "EUR") conversion.textContent = `Total: €${montoConvertido.toFixed(2)} EUR`;

  const tipoPago = document.getElementById("tipo-pago");
  const cuotasSection = document.getElementById("cuotas-section");
  const cuotasSelect = document.getElementById("cuotas");

  tipoPago.addEventListener("change", () => {
    if (tipoPago.value === "credito") {
      cuotasSection.style.display = "block";
      calcularCuota();
    } else {
      cuotasSection.style.display = "none";
      cuotaValor.textContent = "";
    }
  });

  cuotasSelect.addEventListener("change", calcularCuota);

  function calcularCuota() {
    const cuotas = parseInt(cuotasSelect.value);
    const valorBase = moneda === "CLP" ? parseInt(total) : montoConvertido;
    const valorCuota = valorBase / cuotas;

    if (moneda === "USD") {
      cuotaValor.textContent = `Cada cuota: $${valorCuota.toFixed(2)} USD`;
    } else if (moneda === "EUR") {
      cuotaValor.textContent = `Cada cuota: €${valorCuota.toFixed(2)} EUR`;
    } else {
      cuotaValor.textContent = `Cada cuota: $${Math.round(valorCuota).toLocaleString("es-CL")} CLP`;
    }
  }

  const tarjeta = document.getElementById("numero-tarjeta");
  const expiracion = document.getElementById("expiracion");
  const cvv = document.getElementById("cvv");

  tarjeta.addEventListener("input", () => {
    tarjeta.value = tarjeta.value.replace(/[^\d]/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  });

  cvv.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/[^\d]/g, "");
  });

  expiracion.addEventListener("input", () => {
    let val = expiracion.value.replace(/[^\d]/g, "");
    if (val.length >= 3) {
      val = val.slice(0, 2) + "/" + val.slice(2, 4);
    }
    expiracion.value = val.slice(0, 5);
  });

  const form = document.getElementById("form-pago");
  const loading = document.getElementById("estado-cargando");
  const modal = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
  const cerrarModalBtn = document.getElementById("cerrar-modal");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const numeroLimpio = tarjeta.value.replace(/\s/g, "");
    if (numeroLimpio.length !== 16) {
      tarjeta.setCustomValidity("El número de tarjeta debe tener 16 dígitos.");
      tarjeta.reportValidity();
      return;
    } else {
      tarjeta.setCustomValidity("");
    }

    form.style.display = "none";
    loading.style.display = "block";

    setTimeout(() => {
      loading.style.display = "none";
      modal.show();
    }, 2000);
  });

  cerrarModalBtn.addEventListener("click", () => {
    localStorage.removeItem("carrito");
    localStorage.removeItem("totalCompra");
    localStorage.removeItem("numeroOrden");
    localStorage.setItem("mostrarGracias", "true");
    window.location.href = "/";
  });
});
