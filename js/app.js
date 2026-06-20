/**
 * GeoFusaSegura - Lógica de Control del Geovisor
 * Incorpora ArcGIS Maps SDK for JavaScript y Chart.js
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. INICIALIZACIÓN DEL MAPA DE ARCGIS ONLINE
    // ==========================================================================
    require([
        "esri/WebMap",
        "esri/views/MapView",
        "esri/widgets/Legend",
        "esri/widgets/LayerList",
        "esri/widgets/Expand"
    ], function(WebMap, MapView, Legend, LayerList, Expand) {

        // ID del WebMap especificado en los requerimientos
        const webmapId = "178499357aaf45faa467d043119b006c";

        // Carga del mapa web institucional de ArcGIS Online
        const webmap = new WebMap({
            portalItem: {
                id: webmapId
            }
        });

        // Configuración de la vista del mapa en el contenedor HTML
        const view = new MapView({
            container: "mapViewDiv",
            map: webmap,
            padding: { top: 10, bottom: 10 }
        });

        // Una vez cargada la vista, eliminamos el texto de carga por defecto
        view.when(() => {
            const loadingDiv = document.querySelector('.map-loading');
            if (loadingDiv) loadingDiv.remove();
            console.log("WebMap de ArcGIS Online cargado con éxito para Fusagasugá.");
            
            // Vincular los checkboxes de la UI con el encendido/apagado de capas reales
            configurarControlCapas(webmap);
        }, (error) => {
            console.error("Error cargando el WebMap: ", error);
            document.querySelector('.map-loading').innerText = "Error al cargar el mapa.";
        });

        // Widgets del mapa: Leyenda Expandible
        const legend = new Legend({ view: view });
        const bgLegend = new Expand({
            view: view,
            content: legend,
            expanded: false
        });
        view.ui.add(bgLegend, "bottom-left");

    });

    // ==========================================================================
    // 2. CONEXIÓN DE CHECKBOXES INTERNOS CON CAPAS DEL MAPA
    // ==========================================================================
    function configurarControlCapas(webmap) {
        // Estructura preparada para asociar los IDs de capa de ArcGIS a los checkbox HTML
        // NOTA: Reemplazar los 'id_de_la_capa_en_arcgis' con los IDs reales cuando agregues capas adicionales
        const capaMapping = {
            "chk-hurtos": "capa_hurtos_id",
            "chk-heatmap": "capa_heatmap_id",
            "chk-alumbrado": "capa_alumbrado_id",
            "chk-rutas": "capa_rutas_id",
            "chk-paraderos": "capa_paraderos_id",
            "chk-camaras": "capa_camaras_id",
            "chk-sectores": "capa_sectores_criticos_id"
        };

        // Agregar un escuchador a cada checkbox
        Object.keys(capaMapping).forEach(checkboxId => {
            const chk = document.getElementById(checkboxId);
            if (chk) {
                chk.addEventListener("change", (e) => {
                    const capaRealId = capaMapping[checkboxId];
                    // Buscamos la capa en los recursos cargados del WebMap
                    const layer = webmap.layers.find(lyr => lyr.id === capaRealId || lyr.title.toLowerCase().includes(chk.parentText || ""));
                    
                    if (layer) {
                        layer.visible = e.target.checked;
                    } else {
                        // Log informativo técnico para el desarrollador mientras se cargan capas definitivas
                        console.log(`Control de Capa: '${checkboxId}' cambiado a ${e.target.checked}. (Falta vincular ID final en WebMap)`);
                    }
                });
            }
        });
    }

    // ==========================================================================
    // 3. RENDERIZACIÓN DE GRÁFICOS ESTADÍSTICOS (CHART.JS)
    // ==========================================================================
    
    // Configuración general para tipografías y estilos oscuros en Chart.js
    Chart.defaults.color = '#8fa0dd';
    Chart.defaults.font.family = "'Segoe UI', sans-serif";

    // Gráfico 1: Hurtos por Género (Dona)
    const ctxGenero = document.getElementById('chartGenero').getContext('2d');
    new Chart(ctxGenero, {
        type: 'doughnut',
        data: {
            labels: ['Femenino', 'Masculino'],
            datasets: [{
                data: [54, 46],
                backgroundColor: ['#ff3366', '#00ff66'],
                borderWidth: 1,
                borderColor: '#141b2d'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
        }
    });

    // Gráfico 2: Hurtos por Edad (Barras Horizontales)
    const ctxEdad = document.getElementById('chartEdad').getContext('2d');
    new Chart(ctxEdad, {
        type: 'bar',
        data: {
            labels: ['18-25', '26-40', '41-60', '60+'],
            datasets: [{
                label: 'Casos',
                data: [65, 48, 32, 11],
                backgroundColor: '#00ff66',
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: '#26355a' } },
                y: { grid: { display: false } }
            }
        }
    });

    // Gráfico 3: Modalidad de Hurto (Pie)
    const ctxModalidad = document.getElementById('chartModalidad').getContext('2d');
    new Chart(ctxModalidad, {
        type: 'pie',
        data: {
            labels: ['Atraco', 'Cosquilleo', 'Raponeo', 'Otros'],
            datasets: [{
                data: [72, 34, 40, 10],
                backgroundColor: ['#ff3366', '#ffcc00', '#00ff66', '#8fa0dd'],
                borderWidth: 1,
                borderColor: '#141b2d'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
        }
    });

    // Gráfico 4: Factores de Inseguridad (Radar)
    const ctxFactores = document.getElementById('chartFactores').getContext('2d');
    new Chart(ctxFactores, {
        type: 'radar',
        data: {
            labels: ['Falta Alumbrado', 'Sin Presencia Policial', 'Zonas Desiertas', 'Consumo Sustancias'],
            datasets: [{
                label: 'Nivel de Impacto',
                data: [85, 70, 60, 90],
                backgroundColor: 'rgba(0, 255, 102, 0.2)',
                borderColor: '#00ff66',
                pointBackgroundColor: '#00ff66'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    grid: { color: '#26355a' },
                    angleLines: { color: '#26355a' },
                    pointLabels: { font: { size: 9 } }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // ==========================================================================
    // 4. LÓGICA DE INTERACCIONES DE INTERFAZ (UI)
    // ==========================================================================
    
    // Cambio activo entre botones de la barra de navegación superior
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Botones de filtro por horario
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            timeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            console.log(`Filtro de horario seleccionado: ${btn.innerText}`);
        });
    });
});