import L from 'leaflet';

export class MarkerMap {
    render(map, data, config, context) {
        const markers = [];

        data.forEach(item => {
            if (item.lat && item.lng) {
                const marker = L.marker([item.lat, item.lng])
                    .bindPopup(this.createPopupContent(item))
                    .addTo(map);

                markers.push(marker);
            }
        });

        return markers;
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
