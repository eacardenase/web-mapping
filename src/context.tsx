import React, { useEffect, useState, useContext, createContext } from 'react';
import Map from 'ol/Map';

import { MapContextType } from './@types/olmap';
import Layer from 'ol/layer/Layer';

const AppContext = createContext<MapContextType>({} as MapContextType);

const AppProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [map, setMap] = useState<Map>();

    return (
        <AppContext.Provider
            value={{
                map,
                setMap,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = (): MapContextType => {
    return useContext(AppContext);
};

export { AppContext, AppProvider };
