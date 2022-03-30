import { useState } from "react";
import { Button, FormControl, Modal } from "react-bootstrap";

export default function SaveConfig(props) {
    const { show, setShow, name, setName, config, onSave } = props;
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Save Current {config}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Enter {config} Name:
                <FormControl
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>
                <Button variant="dark"
                    onClick={onSave}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}