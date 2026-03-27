/* --- JS GLOBAL UNTUK PRELOADER --- */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    // 1. Pastikan loader menutupi layar dulu (jika JS dipanggil terlambat)
    preloader.classList.add('active'); 

    // 2. Beri jeda sebentar (misal 500ms) agar user sempat melihat logo space.png
    setTimeout(() => {
        // Hapus kelas active dan tambahkan loaded untuk memicu slide up
        preloader.classList.remove('active');
        preloader.classList.add('loaded');
    }, 500);
});

// 3. LOGIKA UNTUK MENUTUP HALAMAN (Saat klik link)
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Filter: Hanya berlaku untuk link internal (bukan eksternal/target="_blank")
        if (this.hostname === window.location.hostname && !this.hash && this.target !== "_blank") {
            e.preventDefault(); // Tahan perpindahan halaman sebentar
            const destination = this.href;
            const preloader = document.getElementById('preloader');

            // Hapus kelas loaded, tambahkan active untuk memicu slide down
            preloader.classList.remove('loaded');
            preloader.classList.add('active');

            // Beri waktu 900ms (sesuai durasi CSS) untuk animasi, lalu pindah halaman
            setTimeout(() => {
                window.location.href = destination;
            }, 900); 
        }
    });
});
