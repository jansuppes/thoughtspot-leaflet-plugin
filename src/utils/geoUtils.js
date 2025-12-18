export function transformGeoData(dataModel, config) {
    const data = dataModel.getData();
    const columns = dataModel.getColumns();

    // Find lat/lng columns
    const latColumn = columns.find(col => 
        /^(lat|latitude)$/i.test(col.name) || col.name.toLowerCase().includes('lat')
    );
    const lngColumn = columns.find(col => 
        /^(lng|lon|longitude)$/i.test(col.name) || col.name.toLowerCase().includes('lng') || col.name.toLowerCase().includes('lon')
    );

    if (!latColumn || !lngColumn) {
        console.warn('Could not find latitude/longitude columns');
        return [];
    }

    const transformedData = [];

    data.forEach(row => {
        const lat = parseFloat(row[latColumn.id]);
        const lng = parseFloat(row[lngColumn.id]);

        if (!isNaN(lat) && !isNaN(lng)) {
            const item = {
                lat: lat,
                lng: lng
            };

            // Add other columns as properties
            columns.forEach(column => {
                if (column.id !== latColumn.id && column.id !== lngColumn.id) {
                    item[column.name] = row[column.id];
                }
            });

            // Find value for sizing/coloring
            const valueColumn = columns.find(col => col.type === 'measure' && col.id !== latColumn.id && col.id !== lngColumn.id);
            if (valueColumn) {
                item.value = row[valueColumn.id];
            }

            transformedData.push(item);
        }
    });

    return transformedData;
}
