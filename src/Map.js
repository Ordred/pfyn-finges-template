import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import {useState} from "react";

export function MapComponent(props) {
    return <MapContainer
        center={[46.3021, 7.6261]}
        zoom={14.5}
        scrollWheelZoom={true}
        style={{height:'720px', width: '1280px'}}
    >
        <TileLayer url="https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg" />
        {props.pois.map((coordinate) => <POI position={coordinate}/>)}
        <Polyline pathOptions={{ fillColor: 'red', color: 'blue' }} positions={props.pois2}/>
    </MapContainer>
}

function POI(props) {

        return <Marker position={props.position}/>
}

