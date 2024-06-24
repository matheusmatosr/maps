import React, { useState, useMemo, useCallback } from 'react';
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

  const geoJson = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [-48.6485686, -26.9945945]
        },
        properties: {
          id: 1,
          geoName: "Panvel - SC",
          value: [100],
          formattedValue: ["100"],
          maxValueIndex: 0
        }
      },
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [-41.6625, -22.2033]
        },
        properties: {
          id: 2,
          geoName: "PDC - ES",
          value: [100],
          formattedValue: ["100"],
          maxValueIndex: 0
        }
      },
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [-53.2953786, -23.7580282]
        },
        properties: {
          id: 3,
          geoName: "Panvel - PR",
          value: [100],
          formattedValue: ["100"],
          maxValueIndex: 0
        }
      }
    ]
  }), []);

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
