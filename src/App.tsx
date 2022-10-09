import { useState, useEffect } from 'react';

import { useGlobalContext } from './context';

import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import { Drawer } from 'antd';

import Titlebar from '@terrestris/react-geo/dist/Panel/Titlebar/Titlebar';
// import NominatimSearch from '@terrestris/react-geo/dist/Field/NominatimSearch/NominatimSearch';
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';
import MeasureButton from '@terrestris/react-geo/dist/Button/MeasureButton/MeasureButton';
// import SelectFeaturesButton from '@terrestris/react-geo/dist/Button/SelectFeaturesButton/SelectFeaturesButton';
import DrawButton from '@terrestris/react-geo/dist/Button/DrawButton/DrawButton';
import DigitizeButton from '@terrestris/react-geo/dist/Button/DigitizeButton/DigitizeButton';
import ToggleGroup from '@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup';

import 'antd/dist/antd.min.css';
import './react-geo.css';
import './App.css';

import MapWrapper from './components/MapWrapper';

import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import Layer from 'ol/layer/Layer';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const App = () => {
    const { map } = useGlobalContext();

    // set intial state
    const [features, setFeatures] = useState<Feature<Geometry>[]>([]);

    // Drawer
    const [visible, setVisible] = useState(false);

    const fetchData = async () => {
        const barrios4326Data = await fetch('/mapsData/Barrios-4326.geojson');
        const barrios4326 = await barrios4326Data.json();

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

    const toggleDrawer = () => {
        setVisible(!visible);
    };

    return (
        <div className="App">
            <Titlebar
                style={{
                    display: 'flex',
                    padding: '0.7rem 2rem',
                    textAlign: 'left',
                }}
            >
                <SimpleButton onClick={() => setVisible(!visible)}>
                    CatasPro
                </SimpleButton>
            </Titlebar>
            <Drawer
                title="react-geo-application"
                placement="right"
                onClose={toggleDrawer}
                open={visible}
                mask={false}
            >
                <ToggleGroup>
                    <MeasureButton
                        key="measureLine"
                        name="line"
                        map={map}
                        measureType="line"
                        continueLineMsg="Click para iniciar medicion"
                        showMeasureInfoOnClickedPoints
                    >
                        Medir Distancia
                    </MeasureButton>
                    <MeasureButton
                        key="measurePolygon"
                        name="polygon"
                        map={map}
                        measureType="polygon"
                        clickToDrawText="TEST 1"
                        continuePolygonMsg="Click para medir poligono"
                        showMeasureInfoOnClickedPoints
                    >
                        Medir area
                    </MeasureButton>
                    {/* <DrawButton name="drawPolygon" drawType="Polygon">
                        Draw polygon
                    </DrawButton> */}
                    <DigitizeButton
                        name="drawPolygon"
                        map={map}
                        drawType="Polygon"
                    >
                        Crear polygon
                    </DigitizeButton>
                    <DigitizeButton
                        name="selectAndModify"
                        map={map}
                        editType="Edit"
                    >
                        Seleccionar y Modificar Polygon
                    </DigitizeButton>
                    <DigitizeButton
                        name="deleteFeature"
                        map={map}
                        editType="Delete"
                    >
                        Eliminar polygon
                    </DigitizeButton>
                    {/* <SelectFeaturesButton
                        layers={layers}
                        onFeatureSelect={(e) => {
                            console.log(e);

                            setCurrentFeature(e.selected[0]);
                        }}
                    >
                        Select feature
                    </SelectFeaturesButton>
                    {currentFeature && currentFeature.get('NOM_BARRIO')} */}
                </ToggleGroup>
            </Drawer>
            <MapWrapper features={features} />
        </div>
    );
};

export default App;
