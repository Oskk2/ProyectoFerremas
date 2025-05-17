function obtenerUsuarioActual() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  return usuario ? usuario.email : null;
}

function guardarCarritoLocal(carrito) {
  const email = obtenerUsuarioActual();
  if (!email) return;
  localStorage.setItem(`carrito_${email}`, JSON.stringify(carrito));
}

function cargarCarritoLocal() {
  const email = obtenerUsuarioActual();
  if (!email) return [];
  const data = localStorage.getItem(`carrito_${email}`);
  return data ? JSON.parse(data) : [];
}

// Mostrar/Ocultar el navbar lateral del carrito
function toggleCarritoNavbar() {
  const carrito = document.getElementById("miniCarrito");
  carrito.style.display = carrito.style.display === "none" ? "block" : "none";
}

// Eliminar producto del carrito desde el mini carrito
async function eliminarProducto(id) {
  try {
    const formData = new URLSearchParams();
    formData.append("id", id);

    const res = await fetch("/carrito/eliminar", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    if (res.ok) {
      actualizarCarrito();
    } else {
      console.error("Error al eliminar el producto");
    }
  } catch (err) {
    console.error("Error al eliminar", err);
  }
}

async function modificarCantidad(id, cambio) {
  try {
    const formData = new URLSearchParams();
    formData.append("id", id);
    formData.append("cambio", cambio);

    const res = await fetch("/carrito/modificar", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    if (!res.ok) {
      console.error("Error al modificar cantidad");
      return;
    }

    const data = await res.json();

    // Actualiza mini carrito
    actualizarCarrito();

    // Actualiza carrito principal (si existe en DOM)
    const cantidadSpan = document.getElementById(`cantidad-${id}`);
    const subtotalSpan = document.getElementById(`subtotal-${id}`);
    const totalGeneralSpan = document.getElementById("total-general");

    if (cantidadSpan && subtotalSpan && totalGeneralSpan) {
      if (data.subtotal === 0) {
        location.reload();
      } else {
        const nuevaCantidad = parseInt(cantidadSpan.textContent) + cambio;
        cantidadSpan.textContent = nuevaCantidad;
        subtotalSpan.textContent = data.subtotal.toLocaleString();
        totalGeneralSpan.textContent = data.total.toLocaleString();
      }
    }
  } catch (err) {
    console.error("Error al modificar", err);
  }
}

async function actualizarCarrito() {
  try {
    const email = obtenerUsuarioActual();
    if (!email) return;

    const res = await fetch("/api/carrito");
    const data = await res.json();
    guardarCarritoLocal(data);

    const cantidadTotal = data.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById("contador-carrito").textContent = cantidadTotal;

    const lista = document.getElementById("lista-carrito");
    lista.innerHTML = '';

    let totalGlobal = 0;

    data.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      totalGlobal += subtotal;

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-start";

      li.innerHTML = `
        <div class="d-flex align-items-center w-100">
          <img src="/img/${item.imagen}" alt="${item.nombre}" width="50" height="50" class="me-2 rounded">
          <div class="flex-grow-1">
            <div><strong>${item.nombre}</strong></div>
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-outline-secondary me-1" onclick="modificarCantidad(${item.id}, -1)">−</button>
              <span class="px-2">${item.cantidad}</span>
              <button class="btn btn-sm btn-outline-secondary ms-1" onclick="modificarCantidad(${item.id}, 1)">+</button>
            </div>
            <small class="text-muted">Subtotal: $${subtotal.toLocaleString()}</small>
          </div>
          <button class="btn btn-sm btn-outline-danger ms-2 rounded-circle" style="width: 30px; height: 30px;" onclick="eliminarProducto(${item.id})">&times;</button>
        </div>
      `;

      lista.appendChild(li);
    });

    const totalItem = document.createElement("li");
    totalItem.className = "list-group-item d-flex justify-content-between align-items-center fw-bold border-top mt-2 pt-2";
    totalItem.innerHTML = `
      <span>Total:</span>
      <span id="total-general">$${totalGlobal.toLocaleString()}</span>
    `;
    lista.appendChild(totalItem);

  } catch (err) {
    console.error("Error al cargar el carrito", err);
    const localData = cargarCarritoLocal();
    if (localData.length > 0) {
      console.log("Cargando carrito desde localStorage");
      // puedes usar aquí renderizarCarrito(localData) si prefieres
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();

  const finalizarBtn = document.getElementById("finalizar-compra");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      const total = document.getElementById("total-general")?.textContent?.replace(/[^\d]/g, '') || "0";
      const descripcion = "Herramientas FERREMAS";
      const numeroOrden = "ORD-" + Math.floor(Math.random() * 90000 + 10000);
      const totalCorregido = Math.floor(total / 10);

      localStorage.setItem("totalCompra", totalCorregido);
      localStorage.setItem("descripcion", descripcion);
      localStorage.setItem("numeroOrden", numeroOrden);
    });
  }
});