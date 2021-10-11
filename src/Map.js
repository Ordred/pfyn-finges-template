import {MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents} from "react-leaflet";
import {useState} from "react";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'

export function MapComponent(props) {

    let [bounds, setBounds] = useState();
    let [POIS, setPOIS] = useState([{lat: '', lng: ''}, {lat: '', lng: ''}])

    console.log(props);

    return <MapContainer
        center={[46.3021, 7.6261]}
        zoom={14.5}
        scrollWheelZoom={true}
        style={{height:'720px', width: '1280px'}}
    >
        <TileLayer url="https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg" />
        {/*{props.poisCollection != null && props.poisCollection.map((coordinate) => <POI key={coordinate.id} POI={coordinate}/>)}*/}
        {/*{props.wayPoints != null && props.wayPoints.map((way) => <WAYS way={way}/>)}*/}
        {/*<Popup position={props.position}>*/}
        {/*</Popup>*/}
        <Polyline pathOptions={{ fillColor: 'red', color: 'purple' }} positions={props.line}/>
        {/*<MarkerCreation setPosition={props.setPosition}/>*/}
    </MapContainer>
}

function POI(props) {

    let tempLat = +props.POI.latitude;
    let tempLng = +props.POI.longitude;

    console.error(tempLat);
    return <Marker position={{lat: tempLat, lng: tempLng}} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}/>
}

function WAYS(props) {
    return <Polyline pathOptions={{ fillColor: 'red', color: 'blue' }} positions={props.way}/>
}

function MarkerCreation(props) {
    const map = useMapEvents({
        click: (e) => {
            console.log("latlng is :", e.latlng)
            props.setPosition(e.latlng)
        }
    })
    return null;
}

