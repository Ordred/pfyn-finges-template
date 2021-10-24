import React from 'react'


export function ListPOIS(props) {


    return (<ul>
        {props.pois != null && props.pois.map(poi => <ElementPOI key={poi.id} poi={poi}/>)}
    </ul>)

}

function ElementPOI(props) {

    return (<li>
        <p>
            {props.poi.name}
        </p>
        <p>
            {props.poi.description}
        </p>
        <p>
            {props.poi.url}
        </p>
    </li>)
}

