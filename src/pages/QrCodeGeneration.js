import {useState} from "react";

import {QrCode} from "../components/QrCode";
import usePoiCollection from "../hooks/usePoiCollection";

export default function QrCodeGenerationPage() {
    function handlePoiButtonClick(e){
        setCurrentPoiCode(e.target.dataset.poi)
    }

    const poisCollection = usePoiCollection();
    const [currentPoiCode, setCurrentPoiCode] = useState(null);

    return (
        <>
            <p>QRCode generation page</p>
            <ul className="ul-no-bullets">
                { poisCollection &&
                    poisCollection.map(poi => {
                        return <li key={poi.id}><button onClick={handlePoiButtonClick} data-poi={poi.id}>{poi.name}</button></li>
                    })
                }
            </ul>

            { currentPoiCode && <QrCode url={`${process.env.REACT_APP_APPLICATION_BASE_URL}/code/${currentPoiCode}`}/>}
        </>
    )
}
