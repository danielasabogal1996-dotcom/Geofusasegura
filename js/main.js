// Variable global para controlar la gráfica interactiva de franja horaria
let chartFranjaInteractivoInstance = null;
let instanciaGraficaComunasFiel = null;

const FRANJA_DIM_COLOR = 'rgba(28, 63, 36, 0.35)';
const FRANJA_HIGHLIGHT_COLOR = 'rgba(230, 126, 34, 1)';
const paletaVariada1 = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#34495E', '#1ABC9C'];
const paletaVariada2 = ['#2E5A44', '#E6A15C', '#5CA4E6', '#C75CE6', '#E65C7B', '#A1E65C', '#E74C3C'];

// CONTROL DEL MODAL DEL MAPA GENERAL DE HALLAZGOS
function toggleMapaGeneral(show) {
    const modal = document.getElementById('modal-mapa-general');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
}

// LÓGICA DE CONTROL DE PESTAÑAS (alias compatible con switchSection del index)
function showSection(sectionId) {
    if (typeof switchSection === 'function') {
        switchSection(sectionId);
        return;
    }
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (!btn.classList.contains('btn-survey')) {
            btn.classList.remove('active');
        }
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }
    const activeNavBtn = document.getElementById('btn-' + sectionId);
    if (activeNavBtn) {
        activeNavBtn.classList.add('active');
    }
    if (sectionId === 'historico') {
        setTimeout(inicializarGraficaComunasFiel, 120);
    }
}

// CAMBIO DE MAPAS EN FRANJA HORARIA (función legacy conservada)
function changeHeatmapFranja(url, activeBtnId, highlightBarIndex) {
    const frame = document.getElementById('franja-iframe') || document.getElementById('heatmap-frame');
    if (frame) {
        frame.src = url;
    }

    document.querySelectorAll('.submenu-container .sub-btn, .submenu-container-franja .sub-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    const chartRef = chartFranjaInteractivoInstance || (typeof franjaChartInstance !== 'undefined' ? franjaChartInstance : null);
    if (chartRef) {
        const baseColors = [FRANJA_DIM_COLOR, FRANJA_DIM_COLOR, FRANJA_DIM_COLOR, FRANJA_DIM_COLOR];
        baseColors[highlightBarIndex] = FRANJA_HIGHLIGHT_COLOR;
        chartRef.data.datasets[0].backgroundColor = baseColors;
        chartRef.update();
    }
}

function inicializarGraficaComunasFiel() {
    if (typeof inicializarGraficaComunasHistorico === 'function') {
        inicializarGraficaComunasHistorico();
        return;
    }
    setTimeout(() => {
        try {
            const canvasElement = document.getElementById('chartComunasHistoricoFiel');
            if (!canvasElement) return;

            if (instanciaGraficaComunasFiel !== null) {
                instanciaGraficaComunasFiel.resize();
                return;
            }

            instanciaGraficaComunasFiel = new Chart(canvasElement.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: [
                        'Comuna Norte',
                        'Comuna Centro',
                        'Comuna Oriental',
                        'Comuna Sur Oriental',
                        'Comuna Occidental',
                        'Comuna Sur Occidental'
                    ],
                    datasets: [
                        { label: 'ANTES DE 2020', data: [25, 27, 19, 23, 11, 5], backgroundColor: '#2E5A36', borderRadius: 3 },
                        { label: 'DURANTE PANDEMIA', data: [15, 6, 8, 9, 13, 2], backgroundColor: '#E6A15C', borderRadius: 3 },
                        { label: 'DESPUÉS DE PANDEMIA', data: [69, 42, 41, 36, 22, 12], backgroundColor: '#E53E3E', borderRadius: 3 }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: { padding: { left: 4, right: 12 } },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { boxWidth: 12, font: { size: 10, weight: '600' }, padding: 10 }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 78,
                            grid: { color: '#EDF2F7', drawBorder: false },
                            ticks: { font: { size: 10 }, maxTicksLimit: 5 }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { font: { size: 11.5, weight: '600' }, autoSkip: false, padding: 4 }
                        }
                    },
                    datasets: {
                        bar: {
                            maxBarThickness: 15,
                            categoryPercentage: 0.72,
                            barPercentage: 0.88
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error al inicializar la gráfica de comunas históricas:', error);
        }
    }, 120);
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        const ctxFranja = document.getElementById('chartFranjaInteractiva');
        if (ctxFranja) {
            chartFranjaInteractivoInstance = new Chart(ctxFranja.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Madrugada', 'Mañana', 'Tarde', 'Noche'],
                    datasets: [{
                        label: 'Reportes',
                        data: [59, 69, 110, 141],
                        backgroundColor: [FRANJA_HIGHLIGHT_COLOR, FRANJA_DIM_COLOR, FRANJA_DIM_COLOR, FRANJA_DIM_COLOR],
                        borderColor: '#E67E22',
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    } catch (e) { console.error('Error en chartFranjaInteractiva:', e); }

    const chartDefaults = { responsive: true, maintainAspectRatio: false };

    const chartsConfig = [
        { id: 'comunaChart', type: 'pie', data: { labels: ['Centro', 'Norte', 'Occidental', 'Oriental', 'Sur Occidental', 'Sur Oriental'], datasets: [{ data: [75, 109, 46, 68, 19, 68], backgroundColor: paletaVariada1.slice(0, 6) }] }, options: chartDefaults },
        { id: 'generoChart', type: 'doughnut', data: { labels: ['Femenino', 'Masculino', 'No binario / Otro', 'Prefiero no decirlo'], datasets: [{ data: [150, 208, 11, 16], backgroundColor: ['#E84A5F', '#3A86C8', '#FFCC29', '#9966FF'] }] }, options: chartDefaults },
        { id: 'edadChart', type: 'bar', data: { labels: ['60 años o más', 'Entre 18 y 28', 'Entre 29 y 59', 'Menor de 17'], datasets: [{ data: [60, 139, 143, 43], backgroundColor: paletaVariada2.slice(0, 4) }] }, options: { ...chartDefaults, indexAxis: 'y', plugins: { legend: { display: false } } } },
        { id: 'mesChart', type: 'line', data: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], datasets: [{ label: 'Histórico Mensual', data: [27, 48, 42, 20, 18, 39, 23, 34, 34, 37, 38, 25], borderColor: '#FF6384', backgroundColor: 'rgba(255, 99, 132, 0.1)', fill: true, tension: 0.2 }] }, options: chartDefaults },
        { id: 'hurtoChart', type: 'bar', data: { labels: ['Bicicleta', 'Bolso', 'Carro', 'Celular', 'Dinero', 'Documentos', 'Moto', 'Otros'], datasets: [{ data: [66, 124, 19, 112, 165, 94, 45, 9], backgroundColor: paletaVariada1 }] }, options: chartDefaults },
        { id: 'modalidadChart', type: 'bar', data: { labels: ['A pie', 'Arma blanca', 'Arma de fuego', 'Motocicleta', 'Vehículo', 'Engaño', 'Raponazo'], datasets: [{ data: [39, 85, 82, 51, 13, 38, 77], backgroundColor: paletaVariada2 }] }, options: { ...chartDefaults, indexAxis: 'y', plugins: { legend: { display: false } } } },
        { id: 'delincuentesChart', type: 'bar', data: { labels: ['1 persona', '2 personas', '3 o más personas'], datasets: [{ data: [99, 199, 87], backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'] }] }, options: { ...chartDefaults, plugins: { legend: { display: false } } } },
        { id: 'factoresChart', type: 'bar', data: { labels: ['Falta Alumbrado', 'Falta Cámaras', 'Lotes Abandonados', 'Poca Presencia Policial', 'Vías en Mal Estado'], datasets: [{ data: [117, 184, 78, 239, 58], backgroundColor: ['#E74C3C', '#3498DB', '#95A5A6', '#E67E22', '#2ECC71'] }] }, options: chartDefaults }
    ];

    chartsConfig.forEach(cfg => {
        try {
            const el = document.getElementById(cfg.id);
            if (el) new Chart(el.getContext('2d'), { type: cfg.type, data: cfg.data, options: cfg.options });
        } catch (e) { console.error('Error en gráfica ' + cfg.id + ':', e); }
    });
});
