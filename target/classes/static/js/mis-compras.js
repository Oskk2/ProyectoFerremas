document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.id) {
    alert("Debes iniciar sesión para ver tus compras.");
    window.location.href = "/login";
    return;
  }

  try {
    const res = await fetch(`/pedidos/usuario/${usuario.id}`);
    const pedidos = await res.json();
    console.log("Pedidos:", pedidos);

    const contenedor = document.getElementById("lista-pedidos");
    contenedor.innerHTML = "";

    if (pedidos.length === 0) {
      contenedor.innerHTML = `<p class="text-center">No tienes compras registradas.</p>`;
      return;
    }

    pedidos.forEach((pedidoDTO) => {
      const pedido = pedidoDTO.pedido;
      const detalles = pedidoDTO.detalles;

      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4";

      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-header bg-naranjo text-white">
            <h5>Total: $${parseInt(pedido.total).toLocaleString("es-CL")} CLP</h5><br>
            <small>Estado: ${pedido.estado}</small>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              ${detalles.map(det => `
                <li class="list-group-item">
                  <div class="fw-bold">${det.product.nombre}</div>
                  <div>${det.cantidad} x $${parseInt(det.precioUnitario).toLocaleString("es-CL")} CLP</div>
                  <div class="text-end text-success">
                    SubTotal: $${(det.precioUnitario * det.cantidad).toLocaleString("es-CL")} CLP
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;

      contenedor.appendChild(card);
    });

  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    document.getElementById("lista-pedidos").innerHTML = `<p class="text-danger text-center">Error al cargar tus compras.</p>`;
  }
});
