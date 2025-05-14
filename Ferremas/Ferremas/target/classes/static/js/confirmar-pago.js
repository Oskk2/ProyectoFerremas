document.addEventListener("DOMContentLoaded", () => {
  // Mostrar datos de entrega
  const metodo = localStorage.getItem("metodoEntrega");
  const direccion = localStorage.getItem("direccion");
  const comuna = localStorage.getItem("comuna");
  const telefono = localStorage.getItem("telefono");

  document.getElementById("mostrar-metodo").textContent = metodo || "No especificado";

  if (metodo === "domicilio" || metodo === "express") {
    document.getElementById("info-domicilio").style.display = "block";
    document.getElementById("mostrar-direccion").textContent = direccion || "—";
    document.getElementById("mostrar-comuna").textContent = comuna || "—";
    document.getElementById("mostrar-telefono").textContent = telefono || "—";
  }

  // Mostrar total, descripción y número de orden
  const total = localStorage.getItem("totalCompra");
  const descripcion = localStorage.getItem("descripcion");
  const numeroOrden = localStorage.getItem("numeroOrden");

  // Asignar el monto total en CLP por defecto
  document.getElementById("total-compra").textContent = `$${parseInt(total).toLocaleString("es-CL")}`;

  if (descripcion) document.getElementById("descripcion").textContent = descripcion;
  if (numeroOrden) document.getElementById("numero-orden").textContent = numeroOrden;

  // Conversión de moneda
  const monedaSelector = document.getElementById("moneda");
  const resultadoConversion = document.getElementById("resultado-conversion");

  // Guardar moneda inicial en localStorage
  let monedaInicial = localStorage.getItem("moneda") || "CLP";
  monedaSelector.value = monedaInicial;

  // Tasas de conversión exactas (actualizadas)
  const tasasDeCambio = {
    USD: 1 / 943,   // 1 CLP = 1 / 943 USD
    EUR: 1 / 1052,  // 1 CLP = 1 / 1052 EUR
    CLP: 1          // 1 CLP = 1 CLP
  };

  // Función para mostrar el total convertido según la moneda
  const mostrarTotalConMoneda = (moneda) => {
    const montoConvertido = parseInt(total) * tasasDeCambio[moneda];
    
    if (moneda === "USD") {
      resultadoConversion.textContent = `Total en USD: $${montoConvertido.toFixed(2)}`;
    } else if (moneda === "EUR") {
      // Redondear a dos decimales para EUR
      resultadoConversion.textContent = `Total en EUR: €${montoConvertido.toFixed(2)}`;
    } else {
      resultadoConversion.textContent = `Total en CLP: $${parseInt(total).toLocaleString("es-CL")}`;
    }
  };

  // Mostrar el total al cargar
  mostrarTotalConMoneda(monedaInicial);

  // Función para realizar la conversión
  document.getElementById("btn-convertir").addEventListener("click", () => {
    const monedaSeleccionada = monedaSelector.value;
    localStorage.setItem("moneda", monedaSeleccionada); // Guardar la moneda seleccionada

    mostrarTotalConMoneda(monedaSeleccionada);
  });
});

// Limpiar localStorage al pagar
document.getElementById('form-webpay').addEventListener('submit', () => {
  localStorage.removeItem("metodoEntrega");
  localStorage.removeItem("direccion");
  localStorage.removeItem("comuna");
  localStorage.removeItem("telefono");
  localStorage.removeItem("totalCompra");
  localStorage.removeItem("descripcion");
  localStorage.removeItem("numeroOrden");
  localStorage.removeItem("moneda"); // Limpiar la moneda también
});

// Limpiar localStorage al volver al inicio
document.querySelector('a[href="/"]').addEventListener('click', () => {
  localStorage.removeItem("metodoEntrega");
  localStorage.removeItem("direccion");
  localStorage.removeItem("comuna");
  localStorage.removeItem("telefono");
  localStorage.removeItem("totalCompra");
  localStorage.removeItem("descripcion");
  localStorage.removeItem("numeroOrden");
  localStorage.removeItem("moneda"); // Limpiar la moneda también
});
