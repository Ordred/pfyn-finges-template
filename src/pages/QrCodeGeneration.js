
import {useState} from "react";
import {useQRCode} from "react-qrcodes";

export function QrCodeGenerationPage() {
    function handleUrlChange(e){
        setEnteredUrl(e.target.value)
    }

    const [enteredUrl, setEnteredUrl] = useState("");

    // Use effect to load the POIs

    return (
        <>
            <p>QRCode generation page</p>
            <p>
                <input type="url" onChange={handleUrlChange} value={enteredUrl}/>
            </p>
            <p>
                { enteredUrl && <QrCode url={enteredUrl}/> }
            </p>
        </>
    )
}

function QrCode(props){
    let [qrcoderef] = useQRCode({
        text: props.url,
        options: {
            level: 'H',
            margin: 5,
            scale: 4,
            width: 250,
            color: {
                light: "#ffffffff",
                dark: "#000000ff"
            }
        }
    });

    return (
        <>{props.url && <img ref={qrcoderef} alt={"QR code for link " + props.url}/>}</>
    )
}