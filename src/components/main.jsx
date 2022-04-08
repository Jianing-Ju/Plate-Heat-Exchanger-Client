import {
    Button,
    Card,
    Container,
    Row,
    Col,
    ListGroup,
    Table,
    Dropdown,
    OverlayTrigger,
    Tooltip
} from "react-bootstrap"
import DesignItems from "./mainSections/designItems.jsx";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { exportCharts, getDesigns, getFolders } from "../api.js";
import { FaFileExport, FaFolderPlus, FaPlusCircle, FaTrash } from "react-icons/fa";
import NewFolder from "./mainSections/popUps/newFolder.jsx";
import UploadChart from "./mainSections/popUps/uploadChart.jsx";
import FolderItem from "./mainSections/folderItem.jsx";
import AddToFolder from "./mainSections/popUps/addToFolder.jsx";
import DeleteDesign from "./mainSections/popUps/deleteDesign.jsx";
import download from "downloadjs";
import ErrorMessage from "./mainSections/popUps/errorMessage.jsx";

export const MainContext = createContext();

export function Main() {
    const { userId } = useParams();
    const [designs, setDesigns] = useState([]);
    const [initial, setInitial] = useState(true);
    const [showNewFolder, setShowNewFolder] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectedDesigns, setSelectedDesigns] = useState(Array(128).fill(false));
    const [showAddTo, setShowAddTo] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [exportError, setExportError] = useState(false);
    const [filteredDesigns, setFilteredDesigns] = useState([]);
    // console.log(designs);
    // console.log(folders);
    console.log(selectedDesigns)

    // filters
    const typeFilters = {
        all: () => true,
        rating: (design) => design.designType == "rating",
        sizing: (design) => design.designType == "sizing"
    };
    const folderFilters = (folder) => {
        return (design) => design.folderId == folder;
    }
    const [filter, setFilter] = useState(() => typeFilters.all);

    // fetching
    const getAllDesigns = async () => {
        const designs = await getDesigns(userId);
        setDesigns(designs);
        setSelectedDesigns(prev => Array(prev.length).fill(false));
    }
    const getAllFolders = async () => {
        setFolders(await getFolders(userId));
    }
    useEffect(async () => {
        if (initial) {
            setInitial(false);
            getAllFolders();
            getAllDesigns();
        }
    })

    // fucntions
    const getSelected = () => {
        return filteredDesigns.reduce((res, design, index) => {
            if (selectedDesigns[index]) {
                return [...res, design.id];
            } else {
                return [...res];
            }
        }, [])
    }
    const getSelectedDesign = () => {
        return filteredDesigns.reduce((res, design, index) => {
            if (selectedDesigns[index]) {
                return [...res, design];
            } else {
                return [...res];
            }
        }, [])
    }
    // const getFilteredDesigns = ()=> designs.filter((design) => filter(design));
    // // change designs available for select when filter changes
    // useEffect(()=>{
    //     console
    //     setSelectedDesigns( Array(getFilteredDesigns().length).fill(false));
    // }, [filter])

    useEffect(()=>{
        setSelectedDesigns( Array(filteredDesigns.length).fill(false));
    }, [filteredDesigns])

    useEffect(()=>{
        setFilteredDesigns(designs.filter((design) => filter(design)));
    }, [designs, filter])
    

    
    // console.log(selectedDesigns)
    return (
        <MainContext.Provider value={{ folders: folders, updateDesigns: getAllDesigns }}>
            <Container>
                <Row>
                    <Col xs={3} className="folder-col">
                        <ListGroup variant="flush">
                            <ListGroup.Item
                                className="main-tab"
                                onClick={() => setFilter(() => typeFilters.all)}
                            >All</ListGroup.Item>
                            <ListGroup.Item
                                className="main-tab"
                                onClick={() => setFilter(() => typeFilters.rating)}
                            >Rating</ListGroup.Item>
                            <ListGroup.Item
                                className="main-tab"
                                onClick={() => setFilter(() => typeFilters.sizing)}
                            >Sizing</ListGroup.Item>
                        </ListGroup>
                        <div className="d-flex">
                            <h5>Folders</h5>
                            <h5 className="ms-auto" onClick={() => setShowNewFolder(true)}>
                                <FaPlusCircle className="clickable" />
                            </h5>
                        </div>
                        <NewFolder
                            show={showNewFolder}
                            setShow={setShowNewFolder}
                            userId={userId}
                            rank={folders.length + 1}
                            updateFolders={getAllFolders}
                        />

                        <ListGroup variant="flush">
                            {
                                folders.sort((a, b) => a.folderRank - b.folderRank).map((folder) =>
                                    <FolderItem
                                        key={folder.id}
                                        folder={folder}
                                        setFilter={() => setFilter(() => folderFilters(folder.id))}
                                        clearFilter={() => setFilter(() => typeFilters.all)}
                                        updateFolders={getAllFolders}
                                    />
                                )
                            }
                        </ListGroup>
                    </Col>

                    <Col className="designs_col">
                        <div className="mt-1 d-flex align-items-center">
                            <h3 className="d-inline me-auto">Designs</h3>
                            {selectedDesigns.some(value => value) && <div className="tool-box">
                                <OverlayTrigger placement="top" overlay={<Tooltip>Export Selected</Tooltip>}>
                                    <h5 className="me-2 d-inline">
                                        <FaFileExport className="clickable" onClick={async () => {
                                            const blob = await exportCharts(getSelected());
                                            if (!blob) setExportError(true);
                                            else download(blob, `deisgn-${new Date().toLocaleString()}.csv`);
                                        }} />
                                    </h5>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete Selected</Tooltip>}>
                                    <h5 className="me-2 d-inline">
                                        <FaTrash className="me-1 clickable" onClick={() => setShowDelete(true)} />
                                    </h5>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip>Add Selected To Folder</Tooltip>}>
                                    <h5 className="d-inline">
                                        <FaFolderPlus className="clickable" onClick={() => setShowAddTo(true)} />
                                    </h5>
                                </OverlayTrigger>
                            </div>}
                        </div>

                        <Table hover>
                            <thead>
                                <tr>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedDesigns.length && selectedDesigns.every(value => value)}
                                            onChange={(event) => {
                                                setSelectedDesigns(prev => {
                                                    if (prev.every(value => value)) {
                                                        return Array(prev.length).fill(false)
                                                    } else {
                                                        return Array(prev.length).fill(true)
                                                    }
                                                })
                                            }}
                                        />
                                    </td>
                                    <td>Name</td>
                                    <td>Type</td>
                                    <td>Last Modified</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredDesigns.map((design, index) =>
                                        <DesignItems
                                            key={design.id}
                                            design={design}
                                            userId={userId}
                                            folders={folders}
                                            setSelectedDesigns={setSelectedDesigns}
                                            selectedDesigns={selectedDesigns}
                                            index={index}
                                        />
                                    )
                                }
                            </tbody>
                        </Table>
                        <div className="mb-2">
                            <Dropdown className="d-inline">
                                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                    New
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to={`/design/rating?userId=${userId}&designId=new`}>
                                        Rating
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to={`/design/sizing?userId=${userId}&designId=new`}>
                                        Sizing
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>{" "}
                            {/* <Button variant="dark">Select</Button> {" "} */}
                            <Button variant="dark" onClick={() => setShowUpload(true)}>Import</Button>
                        </div>


                        <UploadChart show={showUpload} setShow={setShowUpload} userId={userId} />

                    </Col>
                </Row>
            </Container>
            <AddToFolder show={showAddTo} setShow={setShowAddTo} designId={getSelected()} />
            <DeleteDesign show={showDelete} setShow={setShowDelete} designs={getSelectedDesign()} />
            <ErrorMessage
                show={exportError} setShow={setExportError}
                title={"Unable to Export"} message={"All designs selected are not completed, cannot be exported at the moment."}
            />

        </MainContext.Provider>

    )
}