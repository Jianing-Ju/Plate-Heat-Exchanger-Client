import { useContext, useState } from "react";
import { FormSelect, Modal, Button } from "react-bootstrap";
import { MainContext } from "../../main"
import { setFolder } from "../../../api";

export default function AddToFolder(props) {
    const {show, setShow, designId} = props;
    const { folders, userId, updateDesigns } = useContext(MainContext);
    const [folderSelected, setFolderSelected] = useState("");
    // console.log(designId);
    return (
        <>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Design to Folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Select a Folder:
                    <FormSelect
                        value={folderSelected}
                        onChange={(event) => setFolderSelected(event.target.value)}
                    >
                        <option value="">...</option>
                        {
                            folders.sort((a, b) => a.folderRank - b.folderRank).map((folder) =>
                                <option
                                    key={folder.id}
                                    value={folder.id}
                                >{folder.folderName}</option>
                            )
                        }
                    </FormSelect>

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={folderSelected == ""}
                        variant="dark"
                        onClick={async() => {
                            await setFolder(designId,folderSelected);
                            await updateDesigns();
                            setShow(false);
                        }}
                    >Add</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}