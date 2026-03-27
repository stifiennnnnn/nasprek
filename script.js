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

// Efek transisi halus saat pindah halaman via link <a>
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

/* --- 2. LOGIKA KUIS (10 SOAL - SKOR KETAT) --- */
const buttons = document.querySelectorAll('.tombols button');

if (buttons.length > 0) {
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Cek apakah tombol ini jawaban benar
            const isCorrect = this.getAttribute('data-correct') === 'true';
            
            // Simpan teks jawaban yang dipilih user untuk direview nanti
            const namaFile = window.location.pathname.split("/").pop();
            localStorage.setItem('jawaban_' + namaFile, this.innerText);

            if (isCorrect) {
                // EFEK JIKA BENAR
                this.style.backgroundColor = "#2ecc71"; // Hijau
                this.style.color = "white";
                
                // TAMBAH SKOR (Hanya jika benar)
                let skor = parseInt(localStorage.getItem('skorKuis') || 0);
                localStorage.setItem('skorKuis', skor + 10); 
            } else {
                // EFEK JIKA SALAH
                this.style.backgroundColor = "#e74c3c"; // Merah
                this.style.color = "white";
                
                // Tunjukkan jawaban yang benar (opsional, biar user belajar)
                const correctBtn = document.querySelector('[data-correct="true"]');
                if (correctBtn) {
                    correctBtn.style.backgroundColor = "#2ecc71";
                    correctBtn.style.color = "white";
                }
                // SKOR TIDAK BERTAMBAH DI SINI
            }

            // Kunci semua tombol agar tidak bisa klik berkali-kali
            buttons.forEach(b => b.disabled = true);
        });
    });
}

/* --- 3. HALAMAN RESULT (Result.html) --- */
const progressBar = document.getElementById('progressBar');
const displaySkor = document.getElementById('totalSkor');
const keterangan = document.getElementById('keterangan');
const persenTeks = document.getElementById('persenTeks');
const listJawaban = document.getElementById('listJawaban');

if (progressBar) {
    const skorAkhir = parseInt(localStorage.getItem('skorKuis') || 0);
    
    // Tampilkan angka skor jika elemennya ada
    if (displaySkor) displaySkor.innerText = skorAkhir;

    // Animasi Bar & Angka Persentase
    setTimeout(() => {
        progressBar.style.width = skorAkhir + "%";
        
        if (persenTeks) {
            let startValue = 0;
            let endValue = skorAkhir;
            if (endValue > 0) {
                let counter = setInterval(() => {
                    startValue += 1;
                    persenTeks.innerText = startValue + "%";
                    if (startValue === endValue) clearInterval(counter);
                }, 1500 / endValue);
            } else {
                persenTeks.innerText = "0%";
            }
        }
    }, 500);

    // Tampilkan Review Jawaban (Looping 1-10)
    if (listJawaban) {
        let listHTML = "";
        for (let i = 1; i <= 10; i++) {
            const jawab = localStorage.getItem(`jawaban_soal${i}.html`) || "Tidak dijawab";
            listHTML += `<li>Soal ${i}: <strong>${jawab}</strong></li>`;
        }
        listJawaban.innerHTML = listHTML;
    }

    // Pesan berdasarkan hasil akhir
    if (keterangan) {
        if (skorAkhir === 100) keterangan.innerText = "Gila, Lu Pinter Banget!";
        else if (skorAkhir >= 60) keterangan.innerText = "Lumayan lah...";
        else keterangan.innerText = "Belajar lagi ya dek!";
    }
}

/* --- 4. RESET SISTEM (QuizMenu.html) --- */
// Reset semua data saat user kembali ke menu utama untuk mulai baru
if (window.location.pathname.includes('QuizMenu.html')) {
    localStorage.setItem('skorKuis', 0);
    for (let i = 1; i <= 10; i++) {
        localStorage.removeItem(`jawaban_soal${i}.html`);
    }
}
