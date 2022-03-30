import { Modal } from "react-bootstrap";

export default function PopUp(props){
    const {show, setShow} = props;
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <module.Title></module.Title>
            </Modal.Header>
        </Modal>
    )
}