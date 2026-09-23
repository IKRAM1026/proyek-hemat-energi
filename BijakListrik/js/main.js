// Menangani interaksi menu yang belum aktif (Fase 2 & Fase 3)
document.addEventListener('DOMContentLoaded', () => {
    const disabledLinks = document.querySelectorAll('.nav-item.disabled');

    disabledLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Fitur ini akan terbuka di Fase berikutnya setelah data siap!");
        });
    });
});