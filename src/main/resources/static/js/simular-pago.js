document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("9uvfTn0qfylIv73Sj");
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

    setTimeout(async () => {
      loading.style.display = "none";
      await crearPedidoDespuesDePago(); 
      document.getElementById("correo-confirmado").textContent = document.getElementById("email-destino").value;
      modal.show();
    }, 400);

  });

  cerrarModalBtn.addEventListener("click", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.email) {
      localStorage.removeItem(`carrito_${usuario.email}`);
    }
    localStorage.removeItem("totalCompra");
    localStorage.removeItem("numeroOrden");
    localStorage.setItem("mostrarGracias", "true");
    window.location.href = "/mis-compras";
  });

});

async function crearPedidoDespuesDePago() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.id) return alert("Usuario no identificado.");

  const carrito = JSON.parse(localStorage.getItem(`carrito_${usuario.email}`)) || [];

  const detalles = carrito.map(item => ({
    idProducto: item.id,
    cantidad: item.cantidad,
    precioUnitario: item.precio
  }));

  const total = detalles.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0);

  const response = await fetch("/pedidos/crear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idUsuario: usuario.id,
      total: total,
      detalles: detalles
    })
  });

  if (response.ok) {
    console.log("Pedido creado con éxito.");
    await enviarComprobanteEmail(usuario, carrito, total, localStorage.getItem("numeroOrden"));

  } else {
    console.error("Error al crear el pedido.");
    alert("Error al registrar el pedido. Intente nuevamente.");
  }

}

const SERVICE_ID = "service_4vmlvu8"; 
const TEMPLATE_ID = "template_ki0yali"; 

async function enviarComprobanteEmail(usuario, carrito, total, numeroOrden) {
  const emailDestino = document.getElementById("email-destino").value;

  if (!emailDestino) {
    alert("Por favor ingresa un correo para enviar el comprobante.");
    return;
  }

  const listaHTML = carrito.map(item => `
    <tr>
      <td style="padding:8px;border:1px solid #ccc;">${item.nombre}</td>
      <td style="padding:8px;border:1px solid #ccc;">${item.cantidad}</td>
      <td style="padding:8px;border:1px solid #ccc;">$${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
    </tr>
  `).join("");

  const tablaHTML = `
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="padding:8px;border:1px solid #ccc;">Producto</th>
          <th style="padding:8px;border:1px solid #ccc;">Cantidad</th>
          <th style="padding:8px;border:1px solid #ccc;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${listaHTML}
      </tbody>
    </table>
  `;

  const templateParams = {
    to_email: emailDestino,
    to_name: usuario.nombre,
    order_id: numeroOrden,
    totalFinal: total.toLocaleString("es-CL"),
    orders: tablaHTML,
    logo: "FERREMAS"
  };

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log("Correo enviado con éxito:", response.status, response.text);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
}



