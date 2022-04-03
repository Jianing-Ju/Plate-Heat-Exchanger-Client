import { useEffect, useState } from "react";
import { Card, Container, ListGroup, Button, Collapse, Alert } from "react-bootstrap";
import ResultItem from "./resultItem.jsx";
import { parseRating, parseSizing } from "../utils/parseResult.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { exportCharts} from "../../../api.js";
import savePDF from "../utils/savePDF.js";
import download from "downloadjs";

export default function Result(props) {
    const {validPressure, designId, input, type, result} = props;
    const { main: resMain,
        config: resConfig,
        heatTransfer: resHeatTransfer,
        pressure: resPressure } = type == "rating" ? parseRating(result) : parseSizing(result);

    const [showDetail, setshowDetail] = useState(false);
    const [showIter, setShowIter] = useState(false);
    const [PDFDownloading, setPDFDownloading] = useState(false);
    return (
        <div className="input-container">
            <Card id="print-main" className="mb-2">
                <Card.Header>Main Results</Card.Header>
                <ListGroup variant="flush">
                    {
                        resMain.map((item) => (
                            <ResultItem key={item.name} data={item} />
                        ))
                    }
                </ListGroup>
            </Card>
            {type == "sizing" && (resMain[1].value > validPressure.cold || resMain[2].value > validPressure.hot) &&
            <Alert className="mb-2 text-center" variant="danger">Pressure Limit Exceeded!</Alert>
            }

            <Button onClick={() => setshowDetail(!showDetail)} variant="dark" className="steps me-1">
                More Results {" "}
                {showDetail ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
            </Button>
            <Button
                disabled={PDFDownloading}
                className="steps me-1"
                variant="secondary"
                onClick={async () => {
                    setshowDetail(true);
                    // setShowIter(true);
                    setPDFDownloading(true);
                    await savePDF();
                    setPDFDownloading(false);
                }}
            >
                {PDFDownloading ? "Downloading..." : "Save as PDF"}
            </Button>
            <Button
                className="steps" variant="secondary"
                onClick={async()=>{
                    let blob;
                    if (designId == "new" || designId == "demo"){
                        blob = await exportCharts([], {input: input, name: `new ${type}`, designType: type});
                    } else{
                        blob = await exportCharts([designId]);
                    }
                    download(blob, `deisgn-${new Date().toLocaleString()}.csv`);
                }}
            >
                Save as Spreadsheet
            </Button>


            <Collapse in={showDetail} >
                <div>
                    <Card className="steps" id="print-config">
                        <Card.Header>Detailed Results - Configuration</Card.Header>
                        <ListGroup variant="flush">
                            {
                                resConfig.map((item) => (
                                    <ResultItem key={item.name} data={item} />
                                ))
                            }
                        </ListGroup>
                    </Card>
                    <Card className="steps" id="print-detail">
                        <Card.Header>Detailed Results - Heat Transfer</Card.Header>
                        <Collapse in={showIter}>
                            <div>
                                {
                                    resHeatTransfer.slice(0, resHeatTransfer.length - 1).map((iter, index) => (
                                        <ListGroup key={index} variant="flush" className="border-bottom">
                                            <ListGroup.Item className="d-flex align-items-center">
                                                <b>Iteration {index + 1}</b>
                                            </ListGroup.Item>
                                            {
                                                iter.map((item) => (
                                                    <ResultItem key={index + item.name} data={item} />
                                                ))
                                            }
                                        </ListGroup>)

                                    )

                                }
                            </div>
                        </Collapse>

                        <ListGroup variant="flush" className="border-0">

                            <ListGroup.Item className="d-flex align-items-center">
                                <b>Last Iteration</b>
                                <Button
                                    onClick={() => setShowIter(!showIter)}
                                    variant="dark" size="sm" className="ms-auto m-0">
                                    Show All Iterations {" "}
                                    {showIter ? <FontAwesomeIcon icon={faCaretUp} /> :
                                        <FontAwesomeIcon icon={faCaretDown} />}
                                </Button>
                            </ListGroup.Item>
                            {
                                resHeatTransfer[resHeatTransfer.length - 1].map((item) => (
                                    <ResultItem key={item.name} data={item} />
                                ))
                            }
                        </ListGroup>
                    </Card>
                    <Card className="steps" id="print-pressure">
                        <Card.Header>Detailed Results - Pressure</Card.Header>
                        <ListGroup variant="flush">
                            {
                                resPressure.map((item) => (
                                    <ResultItem key={item.name} data={item} />
                                ))
                            }
                        </ListGroup>
                    </Card>
                </div>
            </Collapse>
        </div>

    )
}