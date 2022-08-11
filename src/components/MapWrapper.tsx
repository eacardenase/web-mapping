import { useState, useEffect, useRef, ChangeEvent } from 'react';

// openlayers
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { Coordinate, toStringXY } from 'ol/coordinate';
import OSM from 'ol/source/OSM';
import Geometry from 'ol/geom/Geometry';

import './MapWrapper.css';

const USGSTopo = new TileLayer({
    source: new XYZ({
        url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
    }),
});

const googleMapsTerrain = new TileLayer({
    source: new XYZ({
        url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
    }),
});

const osmLayer = new TileLayer({
    source: new OSM(),
});

function MapWrapper({ features }) {
    // set intial state
    const [map, setMap] = useState();
    const [featuresLayer, setFeaturesLayer] =
        useState<VectorLayer<VectorSource<Geometry>>>();
    const [selectedCoord, setSelectedCoord] = useState<Coordinate>();

    // pull refs
    const mapElement = useRef();

    // create state ref that can be accessed in OpenLayers onclick callback function
    //  https://stackoverflow.com/a/60643670
    const mapRef = useRef();
    mapRef.current = map;

    // initialize map on first render - logic formerly put into componentDidMount
    useEffect(() => {
        // create and add vector source layer
        const initalFeaturesLayer = new VectorLayer({
            source: new VectorSource(),
        });

        // create map
        const initialMap = new Map({
            target: mapElement.current,
            layers: [
                // USGS Topo
                new TileLayer({
                    source: new XYZ({
                        url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
                    }),
                }),

                // Google Maps Terrain
                /* new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
          })
        }), */

                initalFeaturesLayer,
            ],
            view: new View({
                projection: 'EPSG:3857',
                center: [0, 0],
                zoom: 3,
            }),
            controls: [],
        });

        // set map onclick handler
        initialMap.on('click', handleMapClick);

        // save map and vector layer references to state
        setMap(initialMap);
        setFeaturesLayer(initalFeaturesLayer);
    }, []);

    // update map if features prop changes - logic formerly put into componentDidUpdate
    useEffect(() => {
        if (features.length) {
            // may be null on first render

            // set features to map
            featuresLayer &&
                featuresLayer.setSource(
                    new VectorSource({
                        features: features, // make sure features is an array
                    })
                );

            // fit map to feature extent (with 100px of padding)
            map?.getView().fit(featuresLayer.getSource().getExtent(), {
                padding: [100, 100, 100, 100],
            });
        }
    }, [features]);

    // map click handler
    const handleMapClick = (event) => {
        // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
        //  https://stackoverflow.com/a/60643670
        const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);

        // transform coord to EPSG 4326 standard Lat Long
        const transormedCoord = transform(
            clickedCoord,
            'EPSG:3857',
            'EPSG:4326'
        );

        // set React state
        setSelectedCoord(transormedCoord);
    };

    // render component
    return (
        <div>
            <div ref={mapElement} className="map-container"></div>

            <div className="clicked-coord-label">
                <p>{selectedCoord ? toStringXY(selectedCoord, 5) : ''}</p>
            </div>
        </div>
    );
}

export default MapWrapper;
