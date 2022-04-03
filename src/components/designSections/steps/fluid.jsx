import { useContext, useEffect, useState } from "react"
import {
    Card,
    Form,
    InputGroup,
    FormControl,
    Button,
    Dropdown
} from "react-bootstrap"
import { getFluidCond, saveFluidCond } from "../../../api.js";
import { UserContext } from "../../../App.js";
import SaveConfig from "../popUps/saveConfig.jsx";
import DataInput from "../inputUnit/dataInput.jsx"

export default function Fluid(props) {
    const { input, setInput, avail, type, valid, setValid } = props;
    const { userId } = useContext(UserContext);
    const [tempRangeC, setTempRangeC] = useState([]);
    const [tempRangeH, setTempRangeH] = useState([]);
    const [showHot, setShowHot] = useState(false);
    const [showCold, setShowCold] = useState(false);
    const [fluidName, setFluidName] = useState("");
    const [savedFluids, setSavedFluids] = useState([]);
    const [initial, setInitial] = useState(true);

    const getSavedFluid = async () => {
        const allConds = await getFluidCond(userId);
        return allConds.filter((fluidCond) => fluidCond.designType == type);
    }

    const onSaveCold = async () => {
        const fluidCond = Object.entries(input).reduce((obj, pair) => {
            if (pair[0].search("C")!=-1){
                return {
                    ...obj,
                    [pair[0].slice(0, -1)]: pair[1]
                }
            } else {
                return {...obj};
            }
        }, {})
        await saveFluidCond(fluidCond, userId, fluidName, type);
        setShowCold(false);
        setSavedFluids(await getSavedFluid());
    }
    const onSaveHot = async () => {
        const fluidCond = Object.entries(input).reduce((obj, pair) => {
            if (pair[0].search("H")!=-1){
                return {
                    ...obj,
                    [pair[0].slice(0, -1)]: pair[1]
                }
            } else {
                return {...obj};
            }
        }, {})
        await saveFluidCond(fluidCond, userId, fluidName, type);
        setShowHot(false);
        setSavedFluids(await getSavedFluid());
    }
    useEffect(async () => {
        if (initial) {
            setInitial(false);
            setSavedFluids(await getSavedFluid());
        }
    })
    useEffect(() => {
        if (Object.keys(avail).length) {
            setTempRangeC(avail[input.fluidTypeC]);
            setTempRangeH(avail[input.fluidTypeH]);
        }
    })

    return (
        <Form className="input-container">
            <Card className="mb-2">
                <Card.Header className="d-flex align-items-center">
                    <span>Cold Fluid</span>
                    {userId && <>
                        <Button
                            className="ms-auto me-1" variant="dark" size="sm"
                            onClick={() => setShowCold(true)}
                        >
                            Save</Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="dark" size="sm">Load Saved Fluid Conditions</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    savedFluids.map(fluid =>
                                        <Dropdown.Item
                                            key={fluid.id}
                                            onClick={() => {
                                                Object.keys(input).filter(key => key.search("C") != -1)
                                                    .forEach(param => {
                                                        const paramName = param.slice(0, -1);
                                                        setInput((prevInput) => ({
                                                            ...prevInput,
                                                            fluid: {
                                                                ...prevInput.fluid,
                                                                [param]: fluid[paramName]
                                                            }
                                                        }))
                                                    })
                                            }}
                                        >{fluid.name}</Dropdown.Item>
                                    )
                                }

                            </Dropdown.Menu>
                        </Dropdown>
                    </>}
                </Card.Header>
                <Card.Body>
                    <Form.Select className="form-item"
                        value={input.fluidTypeC}
                        onChange={(event) => {
                            setInput((prevInput) => ({
                                ...prevInput,
                                fluid: {
                                    ...prevInput.fluid,
                                    fluidTypeC: event.target.value
                                }
                            }));
                            // get range of that fluid
                            setTempRangeC(avail[event.target.value]);
                            // clear in/out temp if fluid type is deselected.
                            const clearTemp = type == "sizing" ?
                                {
                                    fluidInTempC: "",
                                    fluidOutTempC: ""
                                } :
                                {
                                    fluidInTempC: ""
                                };
                            setInput((prevInput) => ({
                                ...prevInput,
                                fluid: {
                                    ...prevInput.fluid,
                                    ...clearTemp
                                }
                            }))
                        }}>
                        <option value="">Select fluid type</option>
                        {Object.keys(avail).map(value => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </Form.Select>
                    <DataInput
                        name="fluidInTempC"
                        label="Inlet Temperature"
                        unit="&#176;C"
                        readOnly={!input.fluidTypeC}
                        range={tempRangeC}
                        input={input}
                        setInput={setInput}
                        valid={valid}
                        setValid={setValid}
                    />
                    {type == "sizing" &&
                        <DataInput
                            name="fluidOutTempC"
                            label="Outlet Temperature"
                            unit="&#176;C"
                            readOnly={!input.fluidTypeC}
                            range={tempRangeC}
                            input={input}
                            setInput={setInput}
                            valid={valid}
                            setValid={setValid}
                        />
                    }
                    <DataInput
                        name="fluidMRateC"
                        label="Mass Flow Rate"
                        unit="kg/s"
                        input={input}
                        setInput={setInput}
                        valid={valid}
                        setValid={setValid}
                    />
                    {type == "sizing" &&
                        <DataInput
                            name="fluidMaxPDropC"
                            label="Maximum Allowed Pressure Drop"
                            unit="Pa"
                            input={input}
                            setInput={setInput}
                            valid={valid}
                            setValid={setValid}
                        />
                    }
                    <DataInput
                        classes="form-item-last"
                        name="fluidFoulingC"
                        placeholder="(Optional)"
                        label="Fouling Factor"
                        input={input}
                        setInput={setInput}
                        valid={valid}
                        setValid={setValid}
                    />
                </Card.Body>
            </Card>

            <Card>
                <Card.Header className="d-flex align-items-center">
                    <span>Hot Fluid</span>
                    {userId && <>
                        <Button
                            className="ms-auto me-1" variant="dark" size="sm"
                            onClick={() => setShowHot(true)}
                        >
                            Save</Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="dark" size="sm">Load Saved Fluid Conditions</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    savedFluids.map(fluid =>
                                        <Dropdown.Item
                                            key={fluid.id}
                                            onClick={() => {
                                                Object.keys(input).filter(key => key.search("H") != -1)
                                                    .forEach(param => {
                                                        const paramName = param.slice(0, -1);
                                                        setInput((prevInput) => ({
                                                            ...prevInput,
                                                            fluid: {
                                                                ...prevInput.fluid,
                                                                [param]: fluid[paramName]
                                                            }
                                                        }))
                                                    })
                                            }}
                                        >{fluid.name}</Dropdown.Item>
                                    )
                                }

                            </Dropdown.Menu>
                        </Dropdown>
                    </>}
                </Card.Header>
                <Card.Body>
                    <Form.Select className="form-item"
                        value={input.fluidTypeH}
                        onChange={(event) => {
                            setInput((prevInput) => ({
                                ...prevInput,
                                fluid: {
                                    ...prevInput.fluid,
                                    fluidTypeH: event.target.value
                                }
                            }));
                            // get range of that fluid
                            setTempRangeH(avail[event.target.value]);
                            // clear in/out temp if fluid type is deselected.
                            const clearTemp = type == "sizing" ?
                                {
                                    fluidInTempH: "",
                                    fluidOutTempH: ""
                                } :
                                {
                                    fluidInTempH: ""
                                };
                            setInput((prevInput) => ({
                                ...prevInput,
                                fluid: {
                                    ...prevInput.fluid,
                                    ...clearTemp
                                }
                            }))
                        }}>
                        <option value="">Select fluid type</option>
                        {Object.keys(avail).map(value => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </Form.Select>
                    <DataInput
                        name="fluidInTempH"
                        label="Inlet Temperature"
                        unit="&#176;C"
                        readOnly={!input.fluidTypeH}
                        range={tempRangeH}
                        input={input}
                        setInput={setInput}
                        valid={valid}
                        setValid={setValid}
                    />
                    {type == "sizing" &&
                        <DataInput
                            name="fluidOutTempH"
                            label="Outlet Temperature"
                            unit="&#176;C"
                            readOnly={!input.fluidTypeH}
                            range={tempRangeH}
                            input={input}
                            setInput={setInput}
                            valid={valid}
                            setValid={setValid}
                        />
                    }
                    <DataInput
                        name="fluidMRateH"
                        label="Mass Flow Rate"
                        unit="kg/s"
                        input={input}
                        setInput={setInput}
                        valid={valid}
                        setValid={setValid}
                    />
                    {type == "sizing" &&
                        <DataInput
                            name="fluidMaxPDropH"
                            label="Maximum Allowed Pressure Drop"
                            unit="Pa"
                            input={input}
                            setInput={setInput}
                            valid={valid}
                            setValid={setValid}
                        />
                    }
                    <DataInput
                        classes="form-item-last"
                        name="fluidFoulingH"
                        placeholder="(Optional)"
                        label="Fouling Factor"
                        input={input}
                        setInput={setInput}
                        valid={valid}
                        setValid={setValid}
                    />
                </Card.Body>
            </Card>
            <SaveConfig
                show={showCold}
                setShow={setShowCold}
                name={fluidName}
                setName={setFluidName}
                config={"Fluid Condition"}
                onSave={onSaveCold}
            />
            <SaveConfig
                show={showHot}
                setShow={setShowHot}
                name={fluidName}
                setName={setFluidName}
                config={"Fluid Condition"}
                onSave={onSaveHot}
            />
        </Form>
    )
}