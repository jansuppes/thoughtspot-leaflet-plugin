import L from 'leaflet';
import 'leaflet.markercluster';

export class ClusterMap {
    render(map, data, config, context) {
        const markerCluster = L.markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 80
        });

        data.forEach(item => {
            if (item.lat && item.lng) {
                const marker = L.marker([item.lat, item.lng])
                    .bindPopup(this.createPopupContent(item));
                
                markerCluster.addLayer(marker);
            }
        });

        map.addLayer(markerCluster);
        return markerCluster;
    }

    createPopupContent(item) {
        let content = '<div class="marker-popup">';
        
        Object.keys(item).forEach(key => {
            if (key !== 'lat' && key !== 'lng') {
                content += `<div><strong>${key}:</strong> ${item[key]}</div>`;
            }
        });

        content += '</div>';
        return content;
    }
}
