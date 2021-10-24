import {MapContainer, TileLayer} from "react-leaflet";

export function MapComponent(props) {
    return <MapContainer
        center={[46.3021, 7.6261]}
        zoom={14.5}
        scrollWheelZoom={true}
        style={{height:'80vh', width: '100%'}}
    >
        <TileLayer url="https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg" />

        {props.children}
    </MapContainer>
}
