document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/usuarios/perfil');
    if (!res.ok) throw new Error("No autorizado o error al cargar perfil");

    const usuario = await res.json();
    document.getElementById('nombre-usuario').textContent = usuario.nombre;
    document.getElementById('correo-usuario').textContent = usuario.email;

  } catch (error) {
    alert('No se pudo cargar el perfil. Inicia sesión nuevamente.');
    window.location.href = "/login";
  }
});

document.getElementById('form-cambiar-pass').addEventListener('submit', async function (e) {
  e.preventDefault();

  const actual = document.getElementById('pass-actual').value.trim();
  const nueva = document.getElementById('pass-nueva').value.trim();
  const confirmar = document.getElementById('pass-confirmar').value.trim();
  const msg = document.getElementById('msg-pass');

  msg.textContent = '';
  msg.className = '';

  if (nueva !== confirmar) {
    msg.textContent = "⚠️ Las contraseñas no coinciden.";
    msg.className = "text-danger";
    return;
  }

  try {
    const response = await fetch('/api/usuarios/cambiar-contrasena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actual, nueva })
    });

    const result = await response.text();
    msg.textContent = result;
    msg.className = response.ok ? "text-success" : "text-danger";

    if (response.ok) {
      document.getElementById('form-cambiar-pass').reset();
    }

  } catch (error) {
    msg.textContent = "Ocurrió un error al cambiar la contraseña.";
    msg.className = "text-danger";
  }
});
