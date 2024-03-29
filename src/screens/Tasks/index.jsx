import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import Transcription from "./Transcription";
import ImageValidation from "./ImageValidation";
import AudioValidation from "./AudioValidation";
import { Fragment } from "react";
import { useSelector } from 'react-redux';
import Permissions from "../../utils/permissions";
import PageMeta from "../../components/PageMeta";
import { useParams, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from "react-router-dom";
import { Link } from 'react-router-dom';

function Tasks() {
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const tabs = [];
    const [searchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 0);
    const location = useLocation()
    const params = useParams();

    useEffect(() => {
        const tab = searchParams.get('tab');
        setCurrentTab(tab || 0)
    }, [location, params])

    if (userPermissions.has(Permissions.VALIDATE_AUDIO))
        tabs.push("Audio Validation")

    if (userPermissions.has(Permissions.TRANSCRIBE_AUDIO))
        tabs.push("Transcription")

    if (userPermissions.has(Permissions.RESOLVE_TRANSCRIPTION))
        tabs.push("Trans. Resolution")

    if (userPermissions.has(Permissions.VALIDATE_IMAGE))
        tabs.push("Image Validation")

    return (
        <Fragment>
            <PageMeta title="Validation and Transcription | Speech Data UG" />
            <TopNav />
            <div className="my-3 mx-auto col-md-10 col-11">
                <h4><b>VALIDATION AND TRANSCRIPTION</b></h4>
                <p className="text-muted mb-4">Click on each tab to find available tasks to complete.</p>
                <TabLayout tabs={tabs} currentTab={currentTab}>
                    {userPermissions.has(Permissions.VALIDATE_AUDIO) && <AudioValidation />}
                    {userPermissions.has(Permissions.TRANSCRIBE_AUDIO) && <Transcription />}
                    {userPermissions.has(Permissions.RESOLVE_TRANSCRIPTION) && <Fragment>
                        <div className="d-flex justify-content-center align-items-center" style={{ height: "30vh" }}>
                            <Link  to={"/transcription/resolution"} className="btn btn-outline-primary"> <i className="bi bi-box-arrow-up-right"></i>  Begin transcription resolution</Link>
                        </div>
                    </Fragment>}
                    {userPermissions.has(Permissions.VALIDATE_IMAGE) && <ImageValidation />}
                </TabLayout>
            </div>

            <Footer />
        </Fragment>
    );
}

export default Tasks;
