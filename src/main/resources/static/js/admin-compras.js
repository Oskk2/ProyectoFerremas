document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector("#tabla-compras tbody");
  const comprasGlobal = []; 

  async function cargarCompras() {
    try {
      const res = await fetch("/pedidos/todos");
      if (!res.ok) throw new Error("Error al obtener las compras");
      const compras = await res.json(); 

      tabla.innerHTML = "";
      comprasGlobal.length = 0;

      compras.forEach((dto, index) => {
        comprasGlobal.push(dto);
        const { pedido } = dto;
        const usuario = pedido.usuario || {};
        const usuarioId = usuario.id || "-";
        const nombreUsuario = usuario.nombre_usuario || usuario.nombre || "-";
        const total = pedido.total?.toFixed(2) || "0.00";
        const estado = pedido.estado || "Pendiente";

        tabla.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${pedido.id_pedido || pedido.id}</td>
            <td>${usuarioId}</td>
            <td>${nombreUsuario}</td>
            <td>$${total}</td>
            <td>${estado}</td>
            <td>
              <button class="btn btn-sm btn-naranjo" onclick="verDetalleCompra(${index})">
                👁️ Ver detalle
              </button>
            </td>
          </tr>
        `);
      });
    } catch (err) {
      console.error(err);
      tabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al cargar compras.</td></tr>`;
    }
  }

  window.verDetalleCompra = (index) => {
    const dto = comprasGlobal[index];
    const { pedido, detalles } = dto;
    const usuario = pedido.usuario || {};
    const nombreUsuario = usuario.nombre_usuario || usuario.nombre || "-";

    let html = `
      <p><strong>ID Compra:</strong> ${pedido.id_pedido || pedido.id}</p>
      <p><strong>Usuario:</strong> ${nombreUsuario} (ID: ${usuario.id || "-"})</p>
      <p><strong>Estado:</strong> ${pedido.estado}</p>
      <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
      <hr>
      <h6>Productos:</h6>
      <ul class="list-group">
    `;

    detalles.forEach(item => {
      const prod = item.product || item.producto || {};
      const nombreProd = prod.nombre || prod.nombre_producto || "Producto";
      const precio = (item.precioUnitario || item.precio_unitario || 0).toFixed(2);
      html += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>${item.cantidad} x ${nombreProd}</span>
          <span>$${precio}</span>
        </li>
      `;
    });

    html += `</ul>`;

    document.getElementById("contenidoDetalleCompra").innerHTML = html;

    // Mostramos el modal
    const modalEl = document.getElementById("modalDetalleCompra");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };

  cargarCompras();
});
