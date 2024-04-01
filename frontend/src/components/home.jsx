import './home.css';
import NavBar from "./navbar";
import DecorHeader from "./decorheader";
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

function HomePage() {
    const [issueOneVisible, setIssueOneVisible] = useState(false);
    const [issueTwoVisible, setIssueTwoVisible] = useState(false);
    const [issueThreeVisible, setIssueThreeVisible] = useState(false);

    const [oneNumPages, setOneNumPages] = useState(0);
    const [onePageNumber, setOnePageNumber] = useState(1);

    const [twoNumPages, setTwoNumPages] = useState(0);
    const [twoPageNumber, setTwoPageNumber] = useState(1);

    const [threeNumPages, setThreeNumPages] = useState(0);
    const [threePageNumber, setThreePageNumber] = useState(1);

    const useViewport = () => {
        const [width, setWidth] = React.useState(window.innerWidth);
      
        React.useEffect(() => {
          const handleWindowResize = () => setWidth(window.innerWidth);
          window.addEventListener("resize", handleWindowResize);
          return () => window.removeEventListener("resize", handleWindowResize);
        }, []);
      
        // Return the width so we can use it in our components
        return { width };
      }
      const {width} = useViewport();
      const mobile = width < 800;


    function onIssueOneLoadSuccess({ numPages }) {
        setOneNumPages(numPages);
    }

    function onIssueTwoLoadSuccess({ numPages }) {
        setTwoNumPages(numPages);
    }

    function onIssueThreeLoadSuccess({ numPages }) {
        setThreeNumPages(numPages);
    }

    function issueOneClicked(){
        setIssueOneVisible(true);
        setIssueTwoVisible(false);
        setIssueThreeVisible(false);
    }

    function issueTwoClicked(){
        setIssueTwoVisible(true);
        setIssueOneVisible(false);
        setIssueThreeVisible(false);
    }
    function issueThreeClicked(){
        setIssueTwoVisible(false);
        setIssueOneVisible(false);
        setIssueThreeVisible(true);
    }

    function pageForward(){
        if(issueOneVisible){
            if(onePageNumber < oneNumPages){
                if(onePageNumber == 1 || mobile){
                    setOnePageNumber(onePageNumber + 1);
                }
                else{
                    setOnePageNumber(onePageNumber + 2);
                }
            }

        }
        else if(issueTwoVisible){
            if(twoPageNumber < twoNumPages){
                if(twoPageNumber == 1|| mobile){
                    setTwoPageNumber(twoPageNumber + 1);
                }
                else{
                    setTwoPageNumber(twoPageNumber + 2);
                }
            }

        }
        else if(issueThreeVisible){
            if(threePageNumber < threeNumPages){
                if(threePageNumber == 1|| mobile){
                    setThreePageNumber(threePageNumber + 1);
                }
                else{
                    setThreePageNumber(threePageNumber + 2);
                }
            }

        }
    }

    function pageBack(){
        if(issueOneVisible){
            if(onePageNumber >= 1){
                if(onePageNumber == 2|| mobile){
                    setOnePageNumber(onePageNumber - 1);
                }
                else{
                    setOnePageNumber(onePageNumber - 2);
                }
            }

        }
        if(issueTwoVisible){
            if(twoPageNumber > 1){
                if(twoPageNumber == 2|| mobile){
                    setTwoPageNumber(twoPageNumber - 1);
                }
                else{
                    setTwoPageNumber(twoPageNumber - 2);
                }
            }

        }
        if(issueThreeVisible){
            if(threePageNumber > 1){
                if(threePageNumber == 2|| mobile){
                    setThreePageNumber(threePageNumber - 1);
                }
                else{
                    setThreePageNumber(threePageNumber - 2);
                }
            }

        }
    }

    function closePDF(){
        setIssueOneVisible(false);
        setIssueTwoVisible(false);
        setIssueThreeVisible(false);
    }

    return (
        <div className='full-page'>
            <DecorHeader />
            <NavBar />
            <div style={{ backgroundColor: "beige", width: "100%", padding: "5px", height: "100%" }}>
                <div className="content-container">
                    <img src='/assets/PLCGIF.gif' alt="PLC LOGO" style={{ width: "50%" }} />
                    {issueOneVisible && <Document className="pdf-viewer"file="/assets/PLC1_WEBFLAT.pdf" onLoadSuccess={onIssueOneLoadSuccess}>
                        <Page pageNumber={onePageNumber} width={mobile&& (width-40)}/>
                        {(onePageNumber !== 1 && onePageNumber !== oneNumPages && !mobile) && <Page pageNumber={onePageNumber+1}/>}
                    </Document>}
                    {issueTwoVisible && <Document className="pdf-viewer"file="/assets/PLC2_WEBFLAT.pdf" onLoadSuccess={onIssueTwoLoadSuccess}>
                        <Page pageNumber={twoPageNumber} width={mobile&& width - 40}/>
                        {(twoPageNumber !== 1 && twoPageNumber !== twoNumPages && !mobile) && <Page pageNumber={twoPageNumber+1}/>}
                    </Document>}
                    {issueThreeVisible && <Document className="pdf-viewer"file="/assets/PLC3_WEB.pdf" onLoadSuccess={onIssueThreeLoadSuccess}>
                        <Page pageNumber={threePageNumber} width={mobile&& width - 40}/>
                        {(threePageNumber !== 1 && threePageNumber !== threeNumPages && !mobile) && <Page pageNumber={threePageNumber+1}/>}
                    </Document>}
                    {(issueOneVisible || issueTwoVisible || issueThreeVisible) &&<div className="pdf-interface"><IoIosArrowBack size={30} onClick={pageBack}/><span onClick={closePDF}>CLOSE</span><IoIosArrowForward size={30} onClick={pageForward}/></div>}
                    <div className="zines">
                    <div className="issue" onClick={issueOneClicked}>
                        <img src="/assets/PLC1-thumb.png" alt="PLC issue 1 thumbnail" width="200"/>
                        <span style={{color:"red", textDecoration:"underline", fontSize:"36px", fontWeight:"bold"}}>ISSUE 1</span>
                    </div>
                    <div className="issue" onClick={issueTwoClicked}>
                        <img src="/assets/PLC2-thumb.png" alt="PLC issue 2 thumbnail" width="200"/>
                        <span style={{color:"red", textDecoration:"underline", fontSize:"36px", fontWeight:"bold"}}>ISSUE 2</span>
                    </div>
                    <div className="issue" onClick={issueThreeClicked}>
                        <img src="/assets/PLC3-thumb.png" alt="PLC issue 3 thumbnail" width="200"/>
                        <span style={{color:"red", textDecoration:"underline", fontSize:"36px", fontWeight:"bold"}}>ISSUE 3</span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
