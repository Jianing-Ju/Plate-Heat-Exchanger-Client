import InvalidTag from "./invalidTag.jsx";
import { validData, validate, updateGeo, debounce } from "../utils/validate.js";
import {
    FormControl,
    InputGroup
} from "react-bootstrap";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function DataInput(props) {
    const {name, input, setInput, valid, setValid, range: fetchedRange, 
        classes, label, placeholder, size, readOnly, unit} = props;
    const type = name.search("fluid") == 0 ? "fluid" : name.search("flow") == 0 ? "flow" : "plate";
    const geoNames = ["platePortDia", "plateWidth", "platePortDisH", "platePortDisV", "plateLength"];
    const [message, setMessage] = useState();
    const [empty, setEmpty] = useState(true);
    const [byUser, setByUser] = useState(false);
    const [range, setRange] = useState(validData[name]);

    const validateInputDebounce = useMemo(() => debounce((value, byUser, range, input, setInput, setValid) => {
        // validate
        // range
        let valid = validate(value, range)
        // special
        // 1. flow pass: cannot have 2-3 2-4 3-4
        if (type == "flow" && value != "") {
            const otherName = name == "flowPassC" ? "flowPassH" : "flowPassC";
            const flow1 = value;
            const flow2 = input[otherName];
            const [flowLarge, flowSmall] = flow1 > flow2 ?
                [flow1, flow2] : [flow2, flow1];
            if ((flowLarge == 3 && flowSmall == 2) ||
                (flowLarge == 4 && flowSmall == 2) ||
                (flowLarge == 4 && flowSmall == 3)) {
                valid = false;
                setMessage("Pass configuration 2-3, 2-4 or 3-4 is invalid");
            } else {
                if (valid && flow2) {
                    // set other to be valid also
                    setValid((prevValid) => ({
                        ...prevValid,
                        [otherName]: validate(flow2, range)
                    }))
                }
                setMessage("");
            }
        }
        // 2. Plate geometries: 
        if (valid && byUser && geoNames.includes(name)) {
            // gather all 5 data
            const otherNames = geoNames.filter(value => value != name);
            const geoData = otherNames.reduce((obj, key) => ({
                ...obj,
                [key]: Number(input[key])
            }), { [name]: Number(value) })
            updateGeo(name, geoData);
            // update valid
            const updateData = {};
            const validateData = {}
            for (const [key, value] of Object.entries(geoData)) {
                if (value && key != name) {
                    updateData[key] = Number(value).toFixed(3);
                    validateData[key] = validate(updateData[key], validData[key])
                }
            }
            setInput((prevInput) => ({
                ...prevInput,
                [type]: {
                    ...prevInput[type],
                    ...updateData
                }
            }));
            setValid((prevValid) => ({
                ...prevValid,
                ...validateData
            }))
        }

        if (value != "") setEmpty(false);
        else setEmpty(true);

        setValid((prevValid) => ({
            ...prevValid,
            [name]: valid
        }))

    }), []);

    useEffect(() => {
        validateInputDebounce(input[name], byUser, range, input, setInput, setValid);
    }, [input[name]])

    // update range once ready
    useEffect(()=>{
        if (fetchedRange && fetchedRange.length){
            setRange(fetchedRange);
        }
    }, [fetchedRange])
    name == "flowPassC" && console.log(empty, valid[name]);

    return (
        <div className={classes + " form-item"}>
            <InputGroup size={size} >
                {label && <InputGroup.Text>{label}</InputGroup.Text>}
                <FormControl aria-label={name}
                    value={input[name]}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    onChange={(event) => {
                        const value = event.target.value;
                        setInput((prevInput) => ({
                            ...prevInput,
                            [type]: {
                                ...prevInput[type],
                                [name]: value
                            }
                        }));
                        setByUser(true);
                    }}
                />
                {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
            </InputGroup>
            <InvalidTag range={range} show={!empty && !valid[name]} message={message} />
        </div>

    )
}