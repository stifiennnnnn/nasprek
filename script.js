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

const buttons = document.querySelectorAll('.tombols button');

if (buttons.length > 0) {
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-correct') === 'true';
            const namaFile = window.location.pathname.split("/").pop();
            localStorage.setItem('jawaban_' + namaFile, this.innerText);

            if (isCorrect) {
                this.style.backgroundColor = "#2ecc71";
                this.style.color = "white";
                let skor = parseInt(localStorage.getItem('skorKuis') || 0);
                localStorage.setItem('skorKuis', skor + 10); 
            } else {
                this.style.backgroundColor = "#e74c3c";
                this.style.color = "white";
                const correctBtn = document.querySelector('[data-correct="true"]');
                if (correctBtn) {
                    correctBtn.style.backgroundColor = "#2ecc71";
                    correctBtn.style.color = "white";
                }
            }
            buttons.forEach(b => b.disabled = true);
        });
    });
}

const progressBar = document.getElementById('progressBar');
const displaySkor = document.getElementById('totalSkor');
const keterangan = document.getElementById('keterangan');
const persenTeks = document.getElementById('persenTeks');
const listJawaban = document.getElementById('listJawaban');

if (progressBar) {
    const skorAkhir = parseInt(localStorage.getItem('skorKuis') || 0);
    if (displaySkor) displaySkor.innerText = skorAkhir;

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

    if (listJawaban) {
        let listHTML = "";
        for (let i = 1; i <= 10; i++) {
            const jawab = localStorage.getItem(`jawaban_soal${i}.html`) || "Tidak dijawab";
            listHTML += `<li>Soal ${i}: <strong>${jawab}</strong></li>`;
        }
        listJawaban.innerHTML = listHTML;
    }

    if (keterangan) {
        if (skorAkhir === 100) keterangan.innerText = "Gila, Lu Pinter Banget!";
        else if (skorAkhir >= 60) keterangan.innerText = "Lumayan lah...";
        else keterangan.innerText = "Belajar lagi ya dek!";
    }
}

if (window.location.pathname.includes('QuizMenu.html')) {
    localStorage.setItem('skorKuis', 0);
    for (let i = 1; i <= 10; i++) {
        localStorage.removeItem(`jawaban_soal${i}.html`);
    }
}

const flashcardData = [
    { q: "Benda padat kecil berukuran dari butiran debu hingga bebatuan kecil (asteroid kecil) yang bergerak di ruang antarplanet", a: "Meteoroid" },
    { q: "Nama planet yang menjadi tempat tinggal kita adalah...", a: "Bumi" },
    { q: "Batu meteor yang berhasil bertahan melewati atmosfer dan jatuh ke permukaan Bumi", a: "Meteorit" },
    { q: "Benda langit besar berwujud padat yang mengorbit Matahari, sebagian besar berada di antara orbit Mars dan Jupiter", a: "Asteroid" },
    { q: "Benda langit kecil, seringkali es dan debu, yang memiliki ekor gas dan debu ketika mendekati Matahari", a: "Komet" },
    { q: "Gaya tarik-menarik antara dua objek yang memiliki massa", a: "Gravitasi" },
    { q: "Wadah untuk mengukur massa benda", a: "Neraca / Timbangan" },
    { q: "Fungsi utama atmosfer bumi", a: "Melindungi bumi dari radisi dan benda luar angkasa" },
    { q: "Lapisan atmosfer paling luar yang berbatasan langsung dengan luar angkasa", a: "Eksosfer" },
    { q: "Istilah untuk kumpulan bintang, gas, dan debu yang terikat oleh gravitasi", a: "Galaksi" }
];

let currentIndex = 0;
const card = document.getElementById('flashcard');
const questionText = document.getElementById('questionText');
const answerText = document.getElementById('answerText');
const cardCounter = document.getElementById('cardCounter');

function flipCard() {
    if (card) card.classList.toggle('is-flipped');
}

function updateCardContent() {
    if (card) {
        card.classList.remove('is-flipped');
        setTimeout(() => {
            if (flashcardData[currentIndex]) {
                questionText.innerText = flashcardData[currentIndex].q;
                answerText.innerText = flashcardData[currentIndex].a;
                cardCounter.innerText = `${currentIndex + 1} / ${flashcardData.length}`;
            }
        }, 300);
    }
}

function nextCard() {
    if (currentIndex < flashcardData.length - 1) {
        currentIndex++;
        updateCardContent();
    } else {
        alert("Selesai belajar! Lanjut ke Quiz?");
    }
}

function prevCard() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCardContent();
    }
}
