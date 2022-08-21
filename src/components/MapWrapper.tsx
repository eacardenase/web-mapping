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

function MapWrapper({ features }: any) {
    const [map, setMap] = useState<Map>();
    const [featuresLayer, setFeaturesLayer] =
        useState<VectorLayer<VectorSource<Geometry>>>();
    const [selectedCoord, setSelectedCoord] = useState<Coordinate>();

    const mapElement = useRef();

    const mapRef = useRef();
    mapRef.current = map;

    useEffect(() => {
        const initalFeaturesLayer = new VectorLayer({
            source: new VectorSource(features),
        });

        const itaguiLonLat = [-75.59913, 6.18461];
        const itaguiWebMercator = fromLonLat(itaguiLonLat);

        // create map
        const initialMap = new Map({
            target: mapElement.current,
            view: new View({
                projection: 'EPSG:3857',
                center: itaguiWebMercator,
                zoom: 13,
            }),
            layers: [
                // Google Maps Terrain
                new TileLayer({
                    source: new XYZ({
                        url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
                    }),
                }),

                // new TileLayer({
                //     source: new OSM(),
                // }),

                initalFeaturesLayer,
            ],
            controls: [],
        });

        setMap(initialMap);
        setFeaturesLayer(initalFeaturesLayer);
    }, []);

    useEffect(() => {
        if (features.length) {
            featuresLayer &&
                featuresLayer.setSource(
                    new VectorSource({
                        features: features,
                    })
                );

            map?.getView().fit(featuresLayer!.getSource()!.getExtent(), {
                padding: [100, 100, 100, 100],
            });
        }
    }, [features]);

    return (
        <div>
            <div ref={mapElement} className="map-container"></div>
        </div>
    );
}

export default MapWrapper;
