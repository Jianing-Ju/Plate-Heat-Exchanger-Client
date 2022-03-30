import { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { deleteDesign } from "../../api";
import { MainContext } from "../main";

export default function DeleteDesign(props) {
    const { show, setShow, designs } = props;
    const { updateDesigns } = useContext(MainContext);
    // console.log(designs)
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header>
                <Modal.Title>Delete Design</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Deleting the Design "{designs.map(design=>design.name).join('", "')}"?
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setShow(false)}
                >Cancel</Button>
                <Button
                    variant="dark"
                    onClick={async () => {
                        await deleteDesign(designs.map(design=>design.id));
                        updateDesigns();
                        setShow(false);
                    }}
                >Delete</Button>
            </Modal.Footer>
        </Modal>
    )
}