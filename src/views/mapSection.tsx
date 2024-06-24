import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';
import Map, { Popup, Source, Layer, MapLayerMouseEvent, ViewStateChangeEvent } from 'react-map-gl';
import ControlPanel from '../components/controlPainel';
import 'mapbox-gl/dist/mapbox-gl.css';
import { HoverInfo } from '../typograph/types';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF0aGV1c21hdG9zciIsImEiOiJjbGpzbjJhc20wbm8xM2VydzF2dnZ1MjZuIn0.dRyMErkMI_YzwLvQmL07oA';

const MapSection: React.FC = () => {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [viewState, setViewState] = useState({
    latitude: -14.2350,
    longitude: -51.9253,
    zoom: 4,
    minZoom: 2,
    maxZoom: 14
  });
  const [geoJson, setGeoJson] = useState({
    type: 'FeatureCollection' as const,
    features: [] as any[]
  });

  const locations = [
    { name: "Shopping Vitória", address: "Av. Américo Buaiz, 200 - Enseada do Suá, Vitória - ES, 29050-902" },
    { name: "BH Shopping", address: " BR-356, 3049 - Belvedere, Belo Horizonte - MG, 30320-900" },
    { name: "Shopping RioSul", address: "Rua Lauro Müller, 116 - Botafogo, Rio de Janeiro - RJ, 22290-160" }
  ];

  const geocodeAddress = async (address: string) => {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
      params: {
        access_token: MAPBOX_TOKEN
      }
    });
    const data = response.data;
    if (data && data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { longitude, latitude };
    }
    return null;
  };

  useEffect(() => {
    const fetchGeocodes = async () => {
      const features = [];
      for (const location of locations) {
        const coords = await geocodeAddress(location.address);
        if (coords) {
          features.push({
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [coords.longitude, coords.latitude]
            },
            properties: {
              id: features.length + 1,
              geoName: location.name,
              value: [100],
              formattedValue: ["100"],
              maxValueIndex: 0
            }
          });
        }
      }
      setGeoJson({
        type: 'FeatureCollection',
        features
      });
    };

    fetchGeocodes();
  }, []);

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature) {
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        countyName: feature.properties?.geoName || ''
      });
    }
  }, []);

  return (
    <>
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
          interactiveLayerIds={['points']}
        >
          <Source id="geojson" type="geojson" data={geoJson}>
            <Layer
              id="points"
              type="circle"
              paint={{
                'circle-radius': 10,
                'circle-color': '#007cbf'
              }}
            />
          </Source>
          {hoverInfo && (
            <Popup
              longitude={hoverInfo.longitude}
              latitude={hoverInfo.latitude}
              offset={[0, -10] as [number, number]}
              closeButton={false}
              className="county-info"
            >
              {hoverInfo.countyName}
            </Popup>
          )}
          <ControlPanel />
        </Map>
      </div>
    </>
  );
};

export default MapSection;
