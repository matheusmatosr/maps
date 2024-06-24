import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Map, { Popup, Source, Layer, MapLayerMouseEvent, ViewStateChangeEvent } from 'react-map-gl';
import ControlPanel from '../components/controlPainel';
import { countiesLayer, highlightLayer } from '../utils/map-style';
import { HoverInfo } from '../typograph/types';
import '../App.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF0aGV1c21hdG9zciIsImEiOiJjbGpzbjJhc20wbm8xM2VydzF2dnZ1MjZuIn0.dRyMErkMI_YzwLvQmL07oA'; 

const MapSection: React.FC = () => {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);

  const [viewState, setViewState] = useState({
    latitude: -14.2350,
    longitude: -51.9253,
    zoom: 4,
    minZoom: 2,
    maxZoom: 14
  });

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const county = event.features && event.features[0];
    if (county) {
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        countyName: county.properties?.COUNTY || ''
      });
    }
  }, []);

  const selectedCounty = hoverInfo?.countyName || '';
  const filter = useMemo(() => ['in', 'COUNTY', selectedCounty], [selectedCounty]);
 
  const geoJson = useMemo(() => [
    {
      id: 1,
      coordinates: { lat: -26.9945945, lng: -48.6485686 },
      geoName: "Panvel - SC",
      value: [100],
      formattedValue: ["100"],
      maxValueIndex: 0
    },
    {
      id: 2,
      coordinates: { lat: -23.7580282, lng: -53.2953786 },
      geoName: "Panvel - PR",
      value: [90],
      formattedValue: ["90"],
      maxValueIndex: 0
    }
  ], []);

  useEffect(() => {
    setHoverInfo({
      longitude: geoJson[0].coordinates.lng,
      latitude: geoJson[0].coordinates.lat,
      countyName: geoJson[0].geoName
    });
  }, [geoJson]);

  return (
    <div className='container-map'>
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState({
          ...evt.viewState,
          minZoom: viewState.minZoom,
          maxZoom: viewState.maxZoom
        })}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        interactiveLayerIds={['counties']}
      >
        <Source type="vector" url="mapbox://mapbox.82pkq93d">
          <Layer beforeId="waterway-label" {...countiesLayer} />
          <Layer beforeId="waterway-label" {...highlightLayer} filter={filter} />
        </Source>
        {selectedCounty && hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            offset={[0, -10] as [number, number]}
            closeButton={false}
            className="county-info"
          >
            {selectedCounty}
          </Popup>
        )}
        <ControlPanel />
      </Map>
    </div>
  );
};

export default MapSection;
