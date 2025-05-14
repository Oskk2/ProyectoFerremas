// Mostrar/ocultar campos de dirección según método de entrega
const metodoEntrega = document.getElementById('metodo-entrega');
const direccionFields = document.getElementById('direccion-fields');
const direccionInput = document.getElementById('direccion');
const comunaInput = document.getElementById('comuna');
const telefonoInput = document.getElementById('telefono');

metodoEntrega.addEventListener('change', () => {
  if (metodoEntrega.value === 'domicilio' || metodoEntrega.value === 'express') {
    direccionFields.style.display = 'block';
    direccionInput.setAttribute('required', '');
    comunaInput.setAttribute('required', '');
    telefonoInput.setAttribute('required', '');
  } else {
    direccionFields.style.display = 'none';
    direccionInput.removeAttribute('required');
    comunaInput.removeAttribute('required');
    telefonoInput.removeAttribute('required');
    direccionInput.value = '';
    comunaInput.value = '';
    telefonoInput.value = '';
  }
});

// Validación Bootstrap personalizada
(() => {
  'use strict'
  const form = document.getElementById('form-entrega');
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }
    // Agregar al localstorage
    localStorage.setItem("metodoEntrega", metodoEntrega.value);
    localStorage.setItem("direccion", direccionInput.value);
    localStorage.setItem("comuna", comunaInput.value);
    localStorage.setItem("telefono", telefonoInput.value);

    form.classList.add('was-validated')
  }, false)
})();
