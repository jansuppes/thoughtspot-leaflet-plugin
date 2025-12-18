const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https:", "http:"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: '*', // In production, specify ThoughtSpot domains
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Configuration endpoint for ThoughtSpot
app.get('/config', (req, res) => {
    res.json({
        name: 'Leaflet Maps',
        version: '1.0.0',
        description: 'Interactive mapping visualization with markers, heat maps, and clustering',
        configOptions: [
            {
                key: 'mapType',
                displayName: 'Map Type',
                type: 'dropdown',
                options: [
                    { label: 'Marker Map', value: 'markers' },
                    { label: 'Heat Map', value: 'heatmap' },
                    { label: 'Cluster Map', value: 'cluster' }
                ],
                defaultValue: 'markers'
            }
        ]
    });
});

// Authentication endpoint (simple token validation)
app.post('/auth', express.json(), (req, res) => {
    const { token } = req.body;
    
    // Simple token validation - in production use proper auth
    if (token === 'leaflet-thoughtspot-2024') {
        res.json({ valid: true, message: 'Token validated' });
    } else {
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
});

// Catch all route - serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`ThoughtSpot Leaflet Plugin server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Main app: http://localhost:${PORT}`);
});
