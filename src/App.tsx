import { useState, useEffect } from 'react';

import GeoJSON from 'ol/format/GeoJSON';

import MapWrapper from './components/MapWrapper';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';

import './App.css';

const App = () => {
    // set intial state
    const [features, setFeatures] = useState<Feature<Geometry>[]>([]);

    const fetchData = async () => {
        const response = await fetch('/mock-geojson-api.json');

        const fetchedFeatures = await response.json();

        const wktOptions = {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        };
        const parsedFeatures = new GeoJSON().readFeatures(
            fetchedFeatures,
            wktOptions
        );

        // set features into state (which will be passed into OpenLayers
        //  map component as props)
        setFeatures(parsedFeatures);
    };

    // initialization - retrieve GeoJSON features from Mock JSON API get features from mock
    //  GeoJson API (read from flat .json file in public directory)
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="App">
            <MapWrapper features={features} />
        </div>
    );
};

export default App;
