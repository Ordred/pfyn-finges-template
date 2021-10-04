
import {useState} from "react";

export function QrCodeGenerationPage() {
    function handleUrlChange(e){
        setEnteredUrl(e.target.value)
    }

    const [enteredUrl, setEnteredUrl] = useState("");

    // Use effet to load the POIs

    return (
        <>
            <p>QRCode generation page</p>
            <p>
                <input type="url" onChange={handleUrlChange} value={enteredUrl}/>
            </p>
            <p>
                <QrCode url={enteredUrl}/>
            </p>
        </>
    )
}

function QrCode(props){
    return (
        <p>Entered URL is {props.url}</p>
    )
}