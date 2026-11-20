document.addEventListener('DOMContentLoaded', () => {
    if (typeof DATA_ENERGI === 'undefined') {
        console.error('File data-perilaku-energi.js belum dimuat!');
        return;
    }

    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
    Chart.defaults.color = '#475569';

    // 1. KPI Cards
    document.getElementById('stat-responden').textContent =
        `${DATA_ENERGI.meta.jumlah_responden} Siswa`;
    document.getElementById('stat-skor').textContent =
        `${DATA_ENERGI.ringkasan.rata_rata_skor} / 4,00`;

    // 2. Doughnut Chart: Kategori Perilaku
    const kategoriObj = DATA_ENERGI.ringkasan.kategori;
    const ctxKategori = document.getElementById('chartKategori').getContext('2d');

    new Chart(ctxKategori, {
        type: 'doughnut',
        data: {
            labels: Object.keys(kategoriObj),
            datasets: [{
                data: Object.values(kategoriObj),
                backgroundColor: ['#1B4D3E', '#40916C', '#FBC02D', '#E11D48'],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        font: { weight: '600', size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const total = DATA_ENERGI.meta.jumlah_responden;
                            const val = ctx.raw;
                            const persen = ((val / total) * 100).toFixed(1);
                            return ` ${ctx.label}: ${val} siswa (${persen}%)`;
                        }
                    }
                }
            }
        }
    });

    // 3. Vertical Bar Chart: Skor per Jurusan
    const dataJurusan = DATA_ENERGI.per_jurusan;
    const labelJurusan = dataJurusan.map(item => item.kode);
    const skorJurusan = dataJurusan.map(item => item.rata_rata_skor);
    const warnaJurusan = dataJurusan.map(item =>
        item.kode === DATA_ENERGI.ringkasan.sorotan.jurusan_terendah
            ? '#FBC02D'
            : '#1B4D3E'
    );

    const ctxJurusan = document.getElementById('chartJurusan').getContext('2d');

    new Chart(ctxJurusan, {
        type: 'bar',
        data: {
            labels: labelJurusan,
            datasets: [{
                label: 'Rata-rata Skor',
                data: skorJurusan,
                backgroundColor: warnaJurusan,
                borderRadius: 8,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 2.8,
                    max: 3.7,
                    grid: { color: '#F1F5F9' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { weight: '700' } }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => {
                            const idx = items[0].dataIndex;
                            return `${dataJurusan[idx].kode} - ${dataJurusan[idx].nama}`;
                        },
                        label: (ctx) => ` Rata-rata Skor: ${ctx.raw} / 4,00`
                    }
                }
            }
        }
    });

    // 4. Horizontal Bar Chart: 10 Kebiasaan Hemat Energi
    const dataButir = [...DATA_ENERGI.per_butir].sort((a, b) => b.rata_rata - a.rata_rata);
    const labelButir = dataButir.map(item => `${item.kode} - ${item.label}`);
    const skorButir = dataButir.map(item => item.rata_rata);
    const warnaButir = dataButir.map(item =>
        item.rata_rata <= 3.25 ? '#FBC02D' : '#2D6A4F'
    );

    const ctxButir = document.getElementById('chartButir').getContext('2d');

    new Chart(ctxButir, {
        type: 'bar',
        data: {
            labels: labelButir,
            datasets: [{
                label: 'Skor Rata-rata',
                data: skorButir,
                backgroundColor: warnaButir,
                borderRadius: 6,
                barPercentage: 0.65
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: 2.8,
                    max: 3.7,
                    grid: { color: '#F1F5F9' }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        font: { weight: '600', size: 12 },
                        color: '#1E293B'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const item = dataButir[ctx.dataIndex];
                            return ` Skor: ${ctx.raw} (Jarang dilakukan: ${item.persen_jarang}%)`;
                        }
                    }
                }
            }
        }
    });
});