import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text) =>
  Swal.fire({ icon: 'success', title, text, confirmButtonColor: '#4f46e5' });

export const showErrorAlert = (title, text) =>
  Swal.fire({ icon: 'error', title, text, confirmButtonColor: '#4f46e5' });

export const showConfirmDialog = (title, text) =>
  Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
  });