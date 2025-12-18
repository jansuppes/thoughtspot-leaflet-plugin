import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { MarkerMap } from './maps/markerMap.js';
import { HeatMap } from './maps/heatMap.js';
import { ClusterMap } from './maps/clusterMap.js';
import { transformGeoData } from './utils/geoUtils.js';
import './styles/leaflet-custom.css';

class ThoughtSpotLeafletPlugin {
    constructor() {
        this.version = '1.0.0';
        this.map = null;
        this.mapRenderers = {
            markers: new MarkerMap(),
            heatmap: new HeatMap(),
            cluster: new ClusterMap()
        };

        // Fix Leaflet default markers
        this.fixLeafletMarkers();
    }

    fixLeafletMarkers() {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }

    getDefaultConfig() {
        return {
            mapType: 'markers',
            tileLayer: 'osm',
            showLegend: true,
            center: [39.8283, -98.5795], // US center
            zoom: 4,
            maxZoom: 18
        };
    }

    getTileLayerUrl(type) {
        const tileLayers = {
            osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            cartodb_light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            cartodb_dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        };
        return tileLayers[type] || tileLayers.osm;
    }

    validateData(dataModel) {
        const validation = { isValid: true, warnings: [], errors: [] };

        try {
            const data = dataModel.getData();
            if (!data || data.length === 0) {
                validation.isValid = false;
                validation.errors.push("No data available");
            }
        } catch (error) {
            validation.isValid = false;
            validation.errors.push(`Data validation error: ${error.message}`);
        }

        return validation;
    }

    render(renderContext) {
        const { dataModel, config, containerElement } = renderContext;

        try {
            this.cleanup();

            // Setup container
            containerElement.innerHTML = '';
            containerElement.className = 'leaflet-ts-container';
            
            const mapDiv = document.createElement('div');
            mapDiv.id = `leaflet-map-${Date.now()}`;
            mapDiv.style.width = '100%';
            mapDiv.style.height = '100%';
            mapDiv.style.minHeight = '400px';
            containerElement.appendChild(mapDiv);

            // Transform data
            const geoData = transformGeoData(dataModel, config);
            
            if (!geoData || geoData.length === 0) {
                throw new Error('No valid geographic data found');
            }

            // Initialize map
            this.map = L.map(mapDiv.id, {
                center: config.center || [39.8283, -98.5795],
                zoom: config.zoom || 4,
                maxZoom: config.maxZoom || 18
            });

            // Add tile layer
            L.tileLayer(this.getTileLayerUrl(config.tileLayer), {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            // Render specific map type
            const renderer = this.mapRenderers[config.mapType] || this.mapRenderers.markers;
            renderer.render(this.map, geoData, config, renderContext);

            // Fit bounds to data
            if (geoData.length > 0) {
                const bounds = new L.LatLngBounds();
                geoData.forEach(item => {
                    if (item.lat && item.lng) {
                        bounds.extend([item.lat, item.lng]);
                    }
                });
                if (bounds.isValid()) {
                    this.map.fitBounds(bounds.pad(0.1));
                }
            }

        } catch (error) {
            console.error('[ThoughtSpot Leaflet Plugin] Render error:', error);
            this.showError(containerElement, error.message);
        }
    }

    onResize(width, height) {
        if (this.map) {
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);
        }
    }

    cleanup() {
        if (this.map) {
            this.map.remove();
            this
cat > src/index.js << 'EOF'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { MarkerMap } from './maps/markerMap.js';
import { HeatMap } from './maps/heatMap.js';
import { ClusterMap } from './maps/clusterMap.js';
import { transformGeoData } from './utils/geoUtils.js';
import './styles/leaflet-custom.css';

class ThoughtSpotLeafletPlugin {
    constructor() {
        this.version = '1.0.0';
        this.map = null;
        this.mapRenderers = {
            markers: new MarkerMap(),
            heatmap: new HeatMap(),
            cluster: new ClusterMap()
        };

        // Fix Leaflet default markers
        this.fixLeafletMarkers();
    }

    fixLeafletMarkers() {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }

    getDefaultConfig() {
        return {
            mapType: 'markers',
            tileLayer: 'osm',
            showLegend: true,
            center: [39.8283, -98.5795], // US center
            zoom: 4,
            maxZoom: 18
        };
    }

    getTileLayerUrl(type) {
        const tileLayers = {
            osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            cartodb_light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            cartodb_dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        };
        return tileLayers[type] || tileLayers.osm;
    }

    validateData(dataModel) {
        const validation = { isValid: true, warnings: [], errors: [] };

        try {
            const data = dataModel.getData();
            if (!data || data.length === 0) {
                validation.isValid = false;
                validation.errors.push("No data available");
            }
        } catch (error) {
            validation.isValid = false;
            validation.errors.push(`Data validation error: ${error.message}`);
        }

        return validation;
    }

    render(renderContext) {
        const { dataModel, config, containerElement } = renderContext;

        try {
            this.cleanup();

            // Setup container
            containerElement.innerHTML = '';
            containerElement.className = 'leaflet-ts-container';
            
            const mapDiv = document.createElement('div');
            mapDiv.id = `leaflet-map-${Date.now()}`;
            mapDiv.style.width = '100%';
            mapDiv.style.height = '100%';
            mapDiv.style.minHeight = '400px';
            containerElement.appendChild(mapDiv);

            // Transform data
            const geoData = transformGeoData(dataModel, config);
            
            if (!geoData || geoData.length === 0) {
                throw new Error('No valid geographic data found');
            }

            // Initialize map
            this.map = L.map(mapDiv.id, {
                center: config.center || [39.8283, -98.5795],
                zoom: config.zoom || 4,
                maxZoom: config.maxZoom || 18
            });

            // Add tile layer
            L.tileLayer(this.getTileLayerUrl(config.tileLayer), {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            // Render specific map type
            const renderer = this.mapRenderers[config.mapType] || this.mapRenderers.markers;
            renderer.render(this.map, geoData, config, renderContext);

            // Fit bounds to data
            if (geoData.length > 0) {
                const bounds = new L.LatLngBounds();
                geoData.forEach(item => {
                    if (item.lat && item.lng) {
                        bounds.extend([item.lat, item.lng]);
                    }
                });
                if (bounds.isValid()) {
                    this.map.fitBounds(bounds.pad(0.1));
                }
            }

        } catch (error) {
            console.error('[ThoughtSpot Leaflet Plugin] Render error:', error);
            this.showError(containerElement, error.message);
        }
    }

    onResize(width, height) {
        if (this.map) {
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);
        }
    }

    cleanup() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }

    showError(container, message) {
        container.innerHTML = `
            <div class="leaflet-error">
                <div class="error-icon">🗺️</div>
                <h3>Map Error</h3>
                <p>${message}</p>
                <small>Leaflet Plugin v${this.version}</small>
            </div>
        `;
    }

    destroy() {
        this.cleanup();
    }
}

export default ThoughtSpotLeafletPlugin;

if (typeof window !== 'undefined') {
    window.ThoughtSpotLeafletPlugin = ThoughtSpotLeafletPlugin;
}
