document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Tantangan Hemat Energi Hari Ini (Checklist Interaktif)
    initEnergyChallenge();
});

/**
 * Fitur Tantangan Hemat Energi Hari Ini
 * Mengelola checklist harian, progress bar interaktif, dan persistensi localStorage
 */
function initEnergyChallenge() {
    const checklistItems = document.querySelectorAll('.challenge-checkbox');
    const progressBar = document.getElementById('challengeProgressBar');
    const progressCount = document.getElementById('challengeCount');
    const progressPercent = document.getElementById('challengePercent');
    const completionBadge = document.getElementById('challengeBadge');
    const resetBtn = document.getElementById('resetChallengeBtn');

    if (!checklistItems || checklistItems.length === 0) return;

    const STORAGE_KEY = 'bijaklistrik_challenge_state';
    const totalItems = checklistItems.length;

    // Ambil data status yang tersimpan di localStorage
    function loadSavedState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Gagal membaca status checklist:', e);
            return {};
        }
    }

    // Simpan status terkini ke localStorage
    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Gagal menyimpan status checklist:', e);
        }
    }

    // Perbarui UI progress & visual card
    function updateProgress() {
        const state = loadSavedState();
        let completed = 0;

        checklistItems.forEach(item => {
            const id = item.dataset.id;
            const isChecked = !!state[id];
            item.checked = isChecked;

            const card = item.closest('.challenge-item');
            if (card) {
                if (isChecked) {
                    card.classList.add('completed');
                } else {
                    card.classList.remove('completed');
                }
            }

            if (isChecked) completed++;
        });

        const percentage = Math.round((completed / totalItems) * 100);

        if (progressCount) progressCount.textContent = `${completed}/${totalItems}`;
        if (progressPercent) progressPercent.textContent = `${percentage}% Selesai`;
        if (progressBar) progressBar.style.width = `${percentage}%`;

        if (completionBadge) {
            if (completed === totalItems) {
                completionBadge.classList.add('show');
            } else {
                completionBadge.classList.remove('show');
            }
        }
    }

    // Event listener untuk setiap checkbox
    checklistItems.forEach(item => {
        item.addEventListener('change', (e) => {
            const state = loadSavedState();
            state[e.target.dataset.id] = e.target.checked;
            saveState(state);
            updateProgress();
        });
    });

    // Event listener tombol reset tantangan
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Mulai ulang tantangan hemat energi untuk hari ini?')) {
                saveState({});
                updateProgress();
            }
        });
    }

    // Muat progress saat halaman dimuat
    updateProgress();
}
