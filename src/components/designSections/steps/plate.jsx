import {
    Card,
    Container,
    Form,
    FormControl,
    InputGroup,
    FloatingLabel,
    Button,
    Dropdown
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { useContext, useEffect, useState } from "react";
import DataInput from "../inputUnit/dataInput.jsx";
import { getPlateGeos, savePlateGeo } from "../../../api.js";
import { UserContext } from "../../../App.js";
import SaveConfig from "../popUps/saveConfig.jsx";

const plateGeoParams = ["plateThick", "plateEnlarge", "plateBeta", "platePortDia", "plateWidth",
    "platePortDisH", "platePortDisV", "plateLength", "platePitch"];

export default function Plate(props) {
    const { userId } = useContext(UserContext);
    const [savedGeos, setSavedGeos] = useState([]);
    const [initial, setInitial] = useState(true);
    const [showSave, setShowSave] = useState(false);
    const [geoName, setGeoName] = useState("");

    const onSave = async () => {
        // gather geo data
        const plateGeos = plateGeoParams.reduce((obj, param) => ({
            ...obj,
            [param]: props.input[param]
        }), {});
        await savePlateGeo(plateGeos, userId, geoName);
        setShowSave(false);
        setSavedGeos(await getPlateGeos(userId));
    }
    useEffect(async () => {
        if (initial) {
            setInitial(false);
            setSavedGeos(await getPlateGeos(userId));
        }
    })
    // console.log(savedGeos)

    return (
        <Form className="input-container">
            <Card className="steps">
                <Card.Header>Plate Material</Card.Header>
                <Card.Body>
                    <Form.Select className="form-item"
                        value={props.input.plateMat}
                        onChange={(event) => {
                            props.setInput((prevInput) => ({
                                ...prevInput,
                                plate: {
                                    ...prevInput.plate,
                                    plateMat: event.target.value
                                }
                            }))
                        }}>
                        <option value="">Select plate material</option>
                        {props.avail.map((value) => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </Form.Select>
                    <DataInput
                        classes="form-item-last"
                        name="plateCond"
                        label="Plate Thermal Conductivity"
                        placeholder="(Optional)"
                        unit="W/m∙K"
                        input={props.input}
                        setInput={props.setInput}
                        valid={props.valid}
                        setValid={props.setValid}
                    />
                </Card.Body>
            </Card>
            <Card className="steps">
                <Card.Header className="d-flex align-items-center">
                    <span>Plate Geometry</span>
                    {userId && <>
                        <Button
                            className="ms-auto me-1" variant="dark" size="sm"
                            onClick={() => setShowSave(true)}
                        >Save</Button>

                        <Dropdown>
                            <Dropdown.Toggle variant="dark" size="sm">Load Saved Geometry</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    savedGeos.map((geo) =>
                                        <Dropdown.Item
                                            key={geo.id}
                                            onClick={() => {
                                                plateGeoParams.forEach(param => {
                                                    props.setInput((prevInput) => ({
                                                        ...prevInput,
                                                        plate: {
                                                            ...prevInput.plate,
                                                            [param]: geo[param]
                                                        }
                                                    }))
                                                })
                                            }}
                                        >{geo.name}</Dropdown.Item>
                                    )
                                }

                            </Dropdown.Menu>
                        </Dropdown>
                    </>}
                </Card.Header>
                <Card.Body>
                    <Container className="plate-geo1">
                        <div className="img-input-parent">
                            <DataInput classes="img-input-child input-port-dia"
                                name="platePortDia"
                                unit="m"
                                size="sm"
                                input={props.input}
                                setInput={props.setInput}
                                valid={props.valid}
                                setValid={props.setValid}
                            />
                            <DataInput classes="img-input-child input-width"
                                name="plateWidth"
                                unit="m"
                                size="sm"
                                input={props.input}
                                setInput={props.setInput}
                                valid={props.valid}
                                setValid={props.setValid}
                            />
                            <DataInput classes="img-input-child input-port-dis-h"
                                name="platePortDisH"
                                unit="m"
                                size="sm"
                                input={props.input}
                                setInput={props.setInput}
                                valid={props.valid}
                                setValid={props.setValid}
                            />
                            <DataInput classes="img-input-child input-port-dis-v"
                                name="platePortDisV"
                                unit="m"
                                size="sm"
                                input={props.input}
                                setInput={props.setInput}
                                valid={props.valid}
                                setValid={props.setValid}
                            />
                            <DataInput classes="img-input-child input-port-dis-v"
                                name="platePortDisV"
                                unit="m"
                                size="sm"
                                input={props.input}
                                setInput={props.setInput}
                                valid={props.valid}
                                setValid={props.setValid}
                            />
                            <DataInput classes="img-input-child input-length"
                                name="plateLength"
                                unit="m"
                                size="sm"
                                input={props.input}
                                setInput={props.setInput}
                                valid={props.valid}
                                setValid={props.setValid}
                            />
                            <DataInput classes="img-input-child input-beta"
                                name="plateBeta"
                                unit="&#176;"
                                size="sm"
                                input={props.input}
                                setInput={props.setInput}
                                valid={props.valid}
                                setValid={props.setValid}
                            />
                            <DataInput classes="img-input-child input-thickness"
                                name="plateThick"
                                unit="mm"
                                size="sm"
                                input={props.input}
                                setInput={props.setInput}
                                valid={props.valid}
                                setValid={props.setValid}
                            />
                            <DataInput classes="img-input-child input-pitch"
                                name="platePitch"
                                unit="mm"
                                size="sm"
                                input={props.input}
                                setInput={props.setInput}
                                valid={props.valid}
                                setValid={props.setValid}
                            />
                        </div>
                        <img className="plate-img1" src="https://i.ibb.co/7ybjkZN/Picture-1.png" />
                        <img className="plate-img1" src="https://i.ibb.co/Xydb3fL/Picture-2.png" />

                    </Container>
                    <DataInput
                        classes="form-item-last"
                        name="plateEnlarge"
                        label="Enlargement Fatcor"
                        input={props.input}
                        setInput={props.setInput}
                        valid={props.valid}
                        setValid={props.setValid}
                    />

                </Card.Body>
            </Card>
            {props.type == "rating" &&
                <Card className="steps">
                    <Card.Header>Arrangement</Card.Header>
                    <Card.Body>
                        <DataInput
                            classes="form-item-last"
                            name="plateNum"
                            label="Number of Plates"
                            input={props.input}
                            setInput={props.setInput}
                            valid={props.valid}
                            setValid={props.setValid}
                        />
                    </Card.Body>
                </Card>
            }
            <SaveConfig
                show={showSave}
                setShow={setShowSave}
                name={geoName}
                setName={setGeoName}
                config={"Plate Geometry"}
                onSave={onSave}
            />
        </Form>

    )
}