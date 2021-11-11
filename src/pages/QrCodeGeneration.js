import {useState} from "react";

import {QrCode} from "../components/QrCode";
import usePoiCollection from "../hooks/usePoiCollection";
import {Alert, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {useTranslation} from "react-i18next";

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

    const {t} = useTranslation();

    let poisListForm = null;

    if(poisCollection !== null){
        if(poisCollection.length === 0){
            poisListForm = <Alert color="warning">{t('no_poi')}</Alert>;
        } else {
            poisListForm = (
                <>
                    <FormGroup>
                        <Label for="poi-select"></Label>
                        <Input type="select" id="poi-select" onChange={handlePoiButtonClick} value={currentPoiCode}>
                            <option disabled value="0">{t('select_poi')}</option>
                            <option disabled>----------</option>
                            {poisCollection.map(poi => (<option key={poi.id} value={poi.id}>{poi.name}</option>))}
                        </Input>
                    </FormGroup>

                    { currentPoiCode !== "0" &&
                    <>
                        <h2 style={{marginTop: '1rem'}}>{t('poi_description')}</h2>
                        <p>{poisCollection.find(p => p.id === currentPoiCode).description}</p>
                    </>
                    }
                </>
            )
        }
    }

    return (
        <>
            <h2>{t('qr_code_generation')}</h2>

            <Row>
                <Col sm="12" md="6">
                    <h3>{t('list_poi')}</h3>
                    {poisListForm}
                </Col>
                <Col sm="12" md="6">
                    <h3>{t('generated_qr_code')}</h3>
                    { currentPoiCode !== "0" && <QrCode url={`${process.env.REACT_APP_APPLICATION_BASE_URL}/code/${currentPoiCode}`}/>}
                </Col>
            </Row>
        </>
    )
}
