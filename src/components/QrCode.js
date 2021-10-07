import {useQRCode} from "react-qrcodes";

export function QrCode(props) {
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

    return props.url && <img ref={qrcoderef} alt={"QR code for link " + props.url}/>
}