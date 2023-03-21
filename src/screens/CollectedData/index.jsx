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


function CollectedData() {
    const exportModalRef = useRef(null);
    const toast = useToast()
    const [exportModal, setExportModal] = useState(null);
    const allFields = [
        'IMAGE_URL', "AUDIO_URL", 'ORG_NAME', 'PROJECT_NAME ',
        'SPEAKER_ID', "LOCALE", "GENDER", "AGE", "DEVICE", "ENVIRONMENT",
        "YEAR", "TRANSCRIPTION"
    ]
    const [selectedFields, setSelectedFields] = useState([...allFields])
    const [format, setFormat] = useState("wav")

    const { trigger: exportAudioData, data: responseData, error, isLoading: isLoadingSubmittingExportRequest } = useAxios()

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
                fields: selectedFields,
                format: format,
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
                            <h1 className="h4">Select fields to export</h1>
                            <div>
                                <TagInput
                                    tags={allFields}
                                    placeholder="Select fields to export"
                                    maxTags={allFields.length}
                                    setSelectedTags={setSelectedFields}
                                    selectedTags={selectedFields}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="format"><b>Audio Format</b></label>
                                <select name="format" id="format" className='form-control' onChange={(e) => setFormat(e.target.value)}>
                                    <option value="wav">Wave</option>
                                    <option value="mp3">MP3</option>
                                </select>
                            </div>

                            <div className="form-group d-flex justify-content-center mt-5 mb-2">
                                <button className="btn btn-primary px-5 py-3"
                                    disabled={isLoadingSubmittingExportRequest}
                                    onClick={handleExportAudioData}
                                >
                                    <span className="d-flex">{isLoadingSubmittingExportRequest && <Spinner />} <span className='mx-1'>Submit</span></span>
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
                <TabLayout tabs={["Audios", "Transcriptions", "Images"]}>
                    <AudiosTable />
                    <TranscriptionsTable />
                    <ImagesTable />
                </TabLayout>
            </div>
            <Footer />
        </Fragment>
    );
}

export default CollectedData;
