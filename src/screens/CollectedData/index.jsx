import React, { useState, useRef, useEffect } from 'react'
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import AudiosTable from "./AudiosTable";
import ImagesTable from "./ImagesTable";
import { Fragment } from "react";
import TranscriptionsTable from "./TranscriptionsTable";
import { Modal } from 'bootstrap';
import TagInput from '../../components/TagInput';
import useAxios from '../../app/hooks/useAxios';
import { Spinner, useToast } from '@chakra-ui/react';
import { BASE_API_URI } from '../../utils/constants';
import { useSearchParams } from "react-router-dom";
import LimitedUsersTable from './LimitedUsersTable';
import { useParams, useLocation } from 'react-router-dom'
import UsersTable from './UsersTable';


function CollectedData() {
    const exportModalRef = useRef(null);
    const toast = useToast()
    const [exportModal, setExportModal] = useState(null);
    const allFields = [
        'IMAGE_URL', "AUDIO_URL", 'ORG_NAME', 'PROJECT_NAME ',
        'SPEAKER_ID', "LOCALE", "GENDER", "AGE", "DEVICE", "ENVIRONMENT",
        "YEAR", "TRANSCRIPTION"
    ]

    const [status, setStatus] = useState("accepted")
    const [locale, setLocale] = useState("all")
    const [numberOfFiles, setNumberOfFiles] = useState(0)
    const [tag, setTag] = useState("")


    const [searchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 0);
    const location = useLocation()
    const params = useParams();

    useEffect(() => {
        const tab = searchParams.get('tab');
        setCurrentTab(tab || 0)
    }, [location, params])

    const { trigger: exportAudioData, data: responseData, error, isLoading: isLoadingSubmittingExportRequest } = useAxios({method:"POST"})

    useEffect(() => {
        if (responseData?.message) {
            toast({
                title: "Success",
                position: "top-center",
                description: responseData.message,
                status: "success",
                duration: 3000,
                isClosable: true,
            })
            exportModal?.hide()
        }

    }, [responseData])

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                position: "top-center",
                description: error,
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }, [error])

    const handleExportAudioData = () => {
        exportAudioData(
            `${BASE_API_URI}/export-audio-data/`,
            {
                status: status,
                tag: tag,
                locale: locale,
                "number_of_files": numberOfFiles,
            }
        )
    }

    useEffect(() => {
        if (exportModalRef.current !== null && exportModal === null) {
            const modal = new Modal(exportModalRef.current, { keyboard: false })
            setExportModal(modal)
        }
    }, [])

    const showExportModal = () => {
        exportModal?.show()
    }

    return (
        <Fragment>
            <div ref={exportModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Export Data</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='form-group my-3'>
                                <label htmlFor="status"><b>Audio Status</b></label>
                                <select name="status" id="status" className='form-select' defaultValue={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="accepted">Accepted Audios</option>
                                    <option value="transcription_resolved">Transcribed Audios (Resolved)</option>
                                    <option value="transcribed">Transcribed Audios</option>
                                </select>
                            </div>

                            <div className='form-group my-3'>
                                <label htmlFor="locale"><b>Locale</b></label>
                                <select name="locale" id="locale" className='form-select' defaultValue={locale} onChange={(e) => setLocale(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="ak_gh">Akan</option>
                                    <option value="dga_gh">Dagbani</option>
                                    <option value="dag_gh">Dagaare</option>
                                    <option value="ee_gh">Ewe</option>
                                    <option value="kpo_gh">Ikposo</option>
                                </select>
                            </div>

                            <div className='form-group my-3'>
                                <label htmlFor="file_count"><b>Number of files</b></label>
                                <p className="text-muted">Enter 0 to export all the files that meet the filtering criteria.</p>
                                <p className="text-muted">The audios will be exported after sorting and exported files will be tagged with the provided tag.</p>
                                <input className='form-control' min={0} type="number" value={numberOfFiles} name="file_count" id="file_count" onChange={(e) => setNumberOfFiles(e.target.value)} />
                            </div>

                            <div className='form-group my-3'>
                                <label htmlFor="file_count"><b>Tag</b></label>
                                <p className="text-muted">Tags help export in data batches. Audios with this tag will not be exported again.</p>
                                <p className="text-muted">A good tag can be the current date and time concatenated e.g., <strong>202305101013</strong></p>
                                <input className='form-control' type="text" value={tag} onChange={(e) => setTag(e.target.value)} maxLength={50} />
                            </div>

                            <div className="form-group d-flex justify-content-center mt-5 mb-2">
                                <button className="btn btn-primary"
                                    disabled={isLoadingSubmittingExportRequest}
                                    onClick={handleExportAudioData}
                                >
                                    <span className="d-flex">{isLoadingSubmittingExportRequest && <Spinner />}
                                        <i className="bi bi-file-spreadsheet"></i>
                                        <span className='mx-1'>Submit</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <TopNav />
            <div className="my-3 mx-auto col-md-10">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4><b>COLLECTED DATA</b></h4>
                        <p className="text-muted mb-4">Click on each tab to find available tasks to complete.</p>
                    </div>
                    <div className="">
                        <button className="btn btn-outline-primary" onClick={showExportModal}>
                            <i className="bi bi-file-spreadsheet"></i> Export Data
                        </button>
                    </div>
                </div>
                <TabLayout tabs={["Audios", "Transcriptions", "Images", "Sample", "Users"]} currentTab={currentTab}>
                    <AudiosTable />
                    <TranscriptionsTable />
                    <ImagesTable />
                    <LimitedUsersTable />
                    <UsersTable />
                </TabLayout>
            </div>
            <Footer />
        </Fragment>
    );
}

export default CollectedData;
