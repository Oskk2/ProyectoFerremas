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

  const total = localStorage.getItem("totalCompra");
  const descripcion = localStorage.getItem("descripcion");
  const numeroOrden = localStorage.getItem("numeroOrden");

  document.getElementById("total-compra").textContent = `$${parseInt(total).toLocaleString("es-CL")}`;

  if (descripcion) document.getElementById("descripcion").textContent = descripcion;
  if (numeroOrden) document.getElementById("numero-orden").textContent = numeroOrden;

  const monedaSelector = document.getElementById("moneda");
  const resultadoConversion = document.getElementById("resultado-conversion");

  let monedaInicial = localStorage.getItem("moneda") || "CLP";
  monedaSelector.value = monedaInicial;

  const tasasDeCambio = {
    USD: 1 / 943,   
    EUR: 1 / 1052,  
    CLP: 1          
  };

  const mostrarTotalConMoneda = (moneda) => {
    const montoConvertido = parseInt(total) * tasasDeCambio[moneda];
    
    if (moneda === "USD") {
      resultadoConversion.textContent = `Total en USD: $${montoConvertido.toFixed(2)}`;
    } else if (moneda === "EUR") {
      resultadoConversion.textContent = `Total en EUR: €${montoConvertido.toFixed(2)}`;
    } else {
      resultadoConversion.textContent = `Total en CLP: $${parseInt(total).toLocaleString("es-CL")}`;
    }
  };

  mostrarTotalConMoneda(monedaInicial);

  document.getElementById("btn-convertir").addEventListener("click", () => {
    const monedaSeleccionada = monedaSelector.value;
    localStorage.setItem("moneda", monedaSeleccionada);

    mostrarTotalConMoneda(monedaSeleccionada);
  });
});

document.getElementById('btn-pagar').addEventListener('click', () => {
  const total = document.getElementById('total-compra').textContent.replace(/[^\d]/g, '');
  const orden = document.getElementById('numero-orden').textContent;

  localStorage.setItem("totalCompra", total);
  localStorage.setItem("numeroOrden", orden);

});


document.querySelector('a[href="/"]').addEventListener('click', () => {
  localStorage.removeItem("metodoEntrega");
  localStorage.removeItem("direccion");
  localStorage.removeItem("comuna");
  localStorage.removeItem("telefono");
  localStorage.removeItem("totalCompra");
  localStorage.removeItem("descripcion");
  localStorage.removeItem("numeroOrden");
  localStorage.removeItem("moneda"); 
});
