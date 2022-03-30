import { useState } from "react";
import { ListGroupItem } from "react-bootstrap"
import { FaMinusCircle } from "react-icons/fa";
import { deleteFolder } from "../../api";
export default function FolderItem(props) {
    const {folder, setFilter, clearFilter, updateFolders} = props;
    const [showDelete, setShowDelete] = useState(false);
    return (
        <ListGroupItem
            onClick={setFilter}
            className="main-tab d-flex"
            onMouseEnter={()=>setShowDelete(true)}
            onMouseLeave={()=>setShowDelete(false)}
        >
            {folder.folderName}
            {showDelete && <span className="ms-auto">
                <FaMinusCircle 
                className="clickable" 
                    onClick={async ()=>{
                        console.log("clicked")
                        await deleteFolder(folder.id);
                        updateFolders();
                        clearFilter();
                    }}
                />
            </span>}

        </ListGroupItem>
    )
}