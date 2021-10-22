import {useState} from "react";

import {QrCode} from "../components/QrCode";
import usePoiCollection from "../hooks/usePoiCollection";
import {Alert, Col, FormGroup, Input, Label, Row} from "reactstrap";

export default function QrCodeGenerationPage() {
    function handlePoiButtonClick(e){
        let poiCode = e.target.value;

        if(poiCode === null && poiCode !== "0"){
            return;
        }

        setCurrentPoiCode(poiCode);
    }

    const poisCollection = usePoiCollection();
    const [currentPoiCode, setCurrentPoiCode] = useState("0");

    let poisListForm = null;

    if(poisCollection !== null){
        if(poisCollection.length === 0){
            poisListForm = <Alert color="warning">No points of interest in the database</Alert>;
        } else {
            poisListForm = (
                <>
                    <FormGroup>
                        <Label for="poi-select">Point of interest</Label>
                        <Input type="select" id="poi-select" onChange={handlePoiButtonClick} value={currentPoiCode}>
                            <option disabled value="0">Select the point of interest</option>
                            <option disabled>----------</option>
                            {poisCollection.map(poi => (<option key={poi.id} value={poi.id}>{poi.name}</option>))}
                        </Input>
                    </FormGroup>

                    { currentPoiCode !== "0" &&
                        <>
                            <h2 style={{marginTop: '1rem'}}>Description of the point of interest</h2>
                            <p>{poisCollection.find(p => p.id === currentPoiCode).description}</p>
                        </>
                    }
                </>
            )
        }
    }

    return (
        <>
            <h2>QR Code generation</h2>

            <Row>
                <Col sm="12" md="6">
                    <h3>List of points of interests</h3>
                    {poisListForm}
                </Col>
                <Col sm="12" md="6">
                    <h3>Generated QR code</h3>
                    { currentPoiCode && <QrCode url={`${process.env.REACT_APP_APPLICATION_BASE_URL}/code/${currentPoiCode}`}/>}
                </Col>
            </Row>
        </>
    )
}
