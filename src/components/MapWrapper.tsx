import { useState, useEffect, useRef } from 'react';

// openlayers
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import OSM from 'ol/source/OSM';
import Geometry from 'ol/geom/Geometry';

import './MapWrapper.css';
import { fromLonLat } from 'ol/proj';

import { useGlobalContext } from '../context';

const googleMapLayer = new TileLayer({
    source: new XYZ({
        url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
    }),
});

const OSMLayer = new TileLayer({
    source: new OSM(),
});

function MapWrapper({ features }: any) {
    const { map, setMap } = useGlobalContext();

    const [featuresLayer, setFeaturesLayer] =
        useState<VectorLayer<VectorSource<Geometry>>>();

    const mapElement = useRef();

    const mapRef = useRef();
    mapRef.current = map;

    useEffect(() => {
        const initialFeaturesLayer = new VectorLayer({
            source: new VectorSource(features),
        });

        // create map
        const initialMap = new Map({
            target: mapElement.current,
            view: new View({
                projection: 'EPSG:3857',
                center: [0, 0],
                zoom: 2,
            }),
            layers: [OSMLayer, googleMapLayer, initialFeaturesLayer],
            controls: [],
        });

        setMap(initialMap);
        setFeaturesLayer(initialFeaturesLayer);
    }, []);

    useEffect(() => {
        if (features.length) {
            featuresLayer &&
                featuresLayer.setSource(
                    new VectorSource({
                        features: features,
                    })
                );

            if (featuresLayer) {
                map?.getView().fit(featuresLayer.getSource()!.getExtent(), {
                    padding: [100, 100, 100, 100],
                });
            }
        }
    }, [features]);

    return (
        <div>
            <div ref={mapElement} className="map-container"></div>
        </div>
    );
}

export default MapWrapper;
