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
        const barriosData = await fetch('/mapsData/Barrios.geojson');
        const prediosData = await fetch('/mapsData/Predios.geojson');
        const barrios4326Data = await fetch('/mapsData/Barrios-4326.geojson');
        const construcctionesRuralData = await fetch(
            '/mapsData/ConstruccionesRural.geojson'
        );
        const construcctionesUrbanoData = await fetch(
            '/mapsData/ConstruccionesUrbano.geojson'
        );
        const prediosRuralData = await fetch('/mapsData/PrediosRural.geojson');
        const prediosUrbanoData = await fetch(
            '/mapsData/PrediosUrbano.geojson'
        );
        const veredasData = await fetch('/mapsData/Veredas.geojson');
        const zonaEconomicaRuralData = await fetch(
            '/mapsData/ZonaEconomicaRural.geojson'
        );
        const zonaEconomicaUrbanaData = await fetch(
            '/mapsData/ZonaEconomicasUrb.geojson'
        );
        const zonaFisicaRuralData = await fetch(
            '/mapsData/ZonaFisicaRural.geojson'
        );
        const zonaFisicaUrbanoData = await fetch(
            '/mapsData/ZonaFisicaUrbano.geojson'
        );

        const barrios = await barriosData.json();
        const barrios4326 = await barrios4326Data.json();
        const predios = await prediosData.json();
        const construccionesRural = await construcctionesRuralData.json();
        const construccionesUrbano = await construcctionesUrbanoData.json();
        const prediosRural = await prediosRuralData.json();
        const prediosUrbano = await prediosUrbanoData.json();
        const veredas = await veredasData.json();
        const zonaEconomicaRural = await zonaEconomicaRuralData.json();
        const zonaEconomicaUrbana = await zonaEconomicaUrbanaData.json();
        const zonaFisicaRural = await zonaFisicaRuralData.json();
        const zonaFisicaUrbana = await zonaFisicaUrbanoData.json();

        const wktOptions = {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        };

        const parsedFeatures = new GeoJSON().readFeatures(
            barrios4326,
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
