import { Map } from 'ol';
import Layer from 'ol/layer/Layer';

export type MapContextType = {
    map: Map | undefined;
    setMap: (map: Map) => void;
    layers: Layer[];
    setLayers: (layer: VectorLayer<VectorSource<Geometry>>) => void;
};
