import L from 'leaflet';
import 'leaflet.heat';

export class HeatMap {
    render(map, data, config, context) {
        const heatData = data
            .filter(item => item.lat && item.lng)
            .map(item => [
                item.lat,
                item.lng,
                item.value || 1
            ]);

        if (heatData.length === 0) {
            console.warn('No valid heat map data');
            return null;
        }

        const heatLayer = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17
        }).addTo(map);

        return heatLayer;
    }
}
