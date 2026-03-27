/* --- 1. PRELOADER & TRANSISI HALAMAN --- */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('active'); 
        setTimeout(() => {
            preloader.classList.remove('active');
            preloader.classList.add('loaded');
        }, 500);
    }
});

// Efek transisi pas klik link/tombol navigasi
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.hostname === window.location.hostname && !this.hash && this.target !== "_blank") {
            e.preventDefault(); 
            const destination = this.href;
            const preloader = document.getElementById('preloader');

            if (preloader) {
                preloader.classList.remove('loaded');
                preloader.classList.add('active');
                setTimeout(() => {
                    window.location.href = destination;
                }, 900); 
            } else {
                window.location.href = destination;
            }
        }
    });
});

/* --- 2. LOGIKA KUIS (SOAL 1 & 2) --- */
const buttons = document.querySelectorAll('.tombols button');

if (buttons.length > 0) {
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                this.style.backgroundColor = "#2ecc71"; // Hijau
                this.style.color = "white";
                
                let skor = parseInt(localStorage.getItem('skorKuis') || 0);
                localStorage.setItem('skorKuis', skor + 50); 
            } else {
                this.style.backgroundColor = "#e74c3c"; // Merah
                this.style.color = "white";
                
                // Tunjukin jawaban yang bener
                const correctBtn = document.querySelector('[data-correct="true"]');
                if (correctBtn) {
                    correctBtn.style.backgroundColor = "#2ecc71";
                    correctBtn.style.color = "white";
                }
            }

            // Kunci semua tombol biar nggak bisa klik lagi
            buttons.forEach(b => b.disabled = true);
        });
    });
}

/* --- 3. HALAMAN RESULT (Result.html) --- */
const progressBar = document.getElementById('progressBar');
const displaySkor = document.getElementById('totalSkor');
const keterangan = document.getElementById('keterangan');
const persenTeks = document.getElementById('persenTeks'); // Untuk teks di ujung bar

if (progressBar) {
    const skorAkhir = parseInt(localStorage.getItem('skorKuis') || 0);
    
    // Update teks skor (angka besar)
    if (displaySkor) {
        displaySkor.innerText = skorAkhir;
    }

    // Jalankan animasi Bar dan Angka Persentase
    setTimeout(() => {
        // Gerakkan Bar Hijau
        progressBar.style.width = skorAkhir + "%";
        
        // Animasi angka berhitung di ujung bar
        if (persenTeks) {
            let startValue = 0;
            let endValue = skorAkhir;
            let duration = 1500; // Samakan dengan durasi transition di CSS
            
            if (endValue > 0) {
                let counter = setInterval(() => {
                    startValue += 1;
                    persenTeks.innerText = startValue + "%";
                    if (startValue === endValue) {
                        clearInterval(counter);
                    }
                }, duration / endValue);
            } else {
                persenTeks.innerText = "0%";
            }
        }
    }, 500);

    // Update keterangan
    if (keterangan) {
        if (skorAkhir === 100) {
            keterangan.innerText = "Gila, Lu Pinter Banget!";
        } else if (skorAkhir >= 50) {
            keterangan.innerText = "Lumayan lah...";
        } else {
            keterangan.innerText = "Belajar lagi ya dek!";
        }
    }
}

/* --- 4. RESET SKOR OTOMATIS --- */
// Reset skor jadi 0 tiap kali user masuk ke Menu Utama
if (window.location.pathname.includes('QuizMenu.html')) {
    localStorage.setItem('skorKuis', 0);
}
