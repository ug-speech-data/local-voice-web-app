import './style.scss';
import TableView from '../../components/Table';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Modal } from 'bootstrap';
import {
    useDeleteTranscriptionsMutation,
    useUpdateTranscriptionsMutation,
} from '../../features/resources/resources-api-slice';
import { Spinner, useToast } from '@chakra-ui/react';
import TextOverflow from '../../components/TextOverflow';
import { BASE_API_URI } from '../../utils/constants';
import AudioPlayer from "../../components/AudioPlayer";
import useAxios from '../../app/hooks/useAxios';
import PageMeta from '../../components/PageMeta';
import { useSelector } from 'react-redux';


function TranscriptionsTable() {
    const [triggerReload, setTriggerReload] = useState(0);
    const loggedInUser = useSelector((state) => state.authentication.user);

    const [deleteTranscription, { isLoading: isDeletingTranscription, error: errorDeletingTranscription }] = useDeleteTranscriptionsMutation()
    const [putTranscription, { isLoading: isPuttingTranscription, isSuccess: successPuttingTranscription, error: errorPuttingTranscription }] = useUpdateTranscriptionsMutation()

    const deletionModalRef = useRef(null);
    const editTranscriptionModalRef = useRef(null);
    const toast = useToast()

    const [selectedTranscription, setSelectedTranscription] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [editTranscriptionModal, setEditTranscriptionModal] = useState(null);
    const [newUpdate, setNewUpdate] = useState(null);
    const [isTranscriptionBuffering, setIsTranscriptionBuffering] = useState(true)

    // Form input
    const [name, setName] = useState('');
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        if (editTranscriptionModalRef.current !== null && editTranscriptionModal === null) {
            const modal = new Modal(editTranscriptionModalRef.current)
            setEditTranscriptionModal(modal)
        }
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }
    }, [])

    const handleDeleteTranscription = async () => {
        if (selectedTranscription === null) {
            return
        }
        const response = await deleteTranscription({ id: selectedTranscription.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            setNewUpdate({ item: selectedTranscription, action: "remove" })
            toast({
                position: 'top-center',
                title: `Success`,
                description: "Transcription deleted successfully",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        } else {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: errorMessage,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
        deleteAlertModal?.hide()
    }

    const showEditTranscriptionModal = (image) => {
        setSelectedTranscription(image)
        editTranscriptionModal?.show()
    }

    const showDeleteTranscriptionModal = (image) => {
        setSelectedTranscription(image)
        deleteAlertModal?.show()
    }

    useEffect(() => {
        if (selectedTranscription) {
            setName(selectedTranscription.name)
            setIsAccepted(selectedTranscription.is_accepted)
        }
    }, [selectedTranscription])

    const handleSubmission = async () => {
        if (selectedTranscription === null) {
            return
        }
        const body = {
            name,
            id: selectedTranscription?.id || -1,
            is_accepted: isAccepted,
        }
        const response = await putTranscription(body).unwrap()
        if (response?.transcription !== undefined) {
            setNewUpdate({ item: response.transcription, action: "update" })
        }
    }

    useEffect(() => {
        if (errorPuttingTranscription) {
            toast({
                title: `Error: ${errorPuttingTranscription.status}`,
                description: "An error occurred while updating the image",
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
        if (errorDeletingTranscription) {
            toast({
                title: `Error: ${errorDeletingTranscription.status}`,
                description: "An error occurred while deleting the image",
                position: "top-center",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingTranscription, errorDeletingTranscription])

    useEffect(() => {
        if (successPuttingTranscription) {
            toast({
                title: "Success",
                description: "Transcription updated successfully",
                position: "top-center",
                status: "success",
                duration: 2000,
                isClosable: true,
            })
            editTranscriptionModal?.hide()
        }
    }, [successPuttingTranscription])


    // Bulk actions
    const { trigger: executeBulAudioAction, data: bulkActionResponseData, error: bulkActionError, isLoading: isSubmittingBulkAction } = useAxios({ method: "POST" })
    function handleBulImageAction(ids, action) {
        toast({
            id: "submitting",
            title: `Executing actions for ${ids.length} audios`,
            status: "info",
            position: "top-center",
            isClosable: true,
        })
        executeBulAudioAction(
            `${BASE_API_URI}/transcriptions-bulk-actions/`,
            { ids: ids, action: action }
        )
    }

    useEffect(() => {
        toast.close("submitting")
        if (bulkActionResponseData?.message) {
            toast({
                title: `Info`,
                description: bulkActionResponseData?.message,
                status: "info",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [bulkActionResponseData])

    useEffect(() => {
        toast.close("submitting")
        if (bulkActionError) {
            toast({
                title: `Error`,
                description: bulkActionError,
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [bulkActionError])

    return (
        <Fragment>
            <PageMeta title="Collected Transcriptions | Local Voice" />

            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Transcription - '{selectedTranscription?.audio_url}'
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                <div className="d-flex flex-column">
                                    <h5>Are you sure you want to delete this image?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingTranscription && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteTranscription(selectedTranscription)} >Yes, continue</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={editTranscriptionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                            {selectedTranscription?.audio_url}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body row">
                            <div className="col-md-6 mx-auto">
                                <div className="d-flex justify-content-center align-items-center">
                                    <img src={selectedTranscription?.image_url} alt={selectedTranscription?.audio_url} style={{maxHeight: "40vh"}}/>
                                </div>
                            </div>

                            <div className="col-md-6 mx-auto">
                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Locale</b></label>
                                    <p className="text-justify">{selectedTranscription?.locale}</p>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Audio</b></label>
                                    <div className="d-flex justify-content-start align-items-center">
                                        <AudioPlayer
                                            src={selectedTranscription?.audio_url}
                                            setIsAudioBuffering={setIsTranscriptionBuffering} />

                                        {selectedTranscription && isTranscriptionBuffering && <Spinner
                                            thickness='4px'
                                            speed='0.65s'
                                            emptyColor='gray.200'
                                            size="lg"
                                            color='purple.500'
                                        />}
                                    </div>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Transcriptions</b></label>
                                    {selectedTranscription?.transcriptions?.map((text, index) => {
                                        return <div className='my-3'> 
                                            <p className='text-warning'><strong>Text {index + 1}</strong></p>
                                            <p className="text-justify">{text}</p>
                                        </div>
                                    })}
                                </div>

                                <div className="my-3 d-flex justify-content-end">
                                    <button className="btn btn-primary btn-sm"
                                        disabled={isPuttingTranscription}
                                        onClick={handleSubmission}>{isPuttingTranscription && <Spinner />} Save Changes</button>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mb-5 overflow-scroll">
                <TableView
                    responseDataAttribute="audios"
                    dataSourceUrl={`${BASE_API_URI}/collected-transcriptions/`}
                    newUpdate={newUpdate}
                    filters={[
                        { key: "locale:ak_gh", value: "Akan", defaultValue: loggedInUser?.locale === "ak_gh" },
                        { key: "locale:dga_gh", value: "Dagbani", defaultValue: loggedInUser?.locale === "dga_gh" },
                        { key: "locale:dag_gh", value: "Dagaare", defaultValue: loggedInUser?.locale === "dag_gh" },
                        { key: "locale:ee_gh", value: "Ewe", defaultValue: loggedInUser?.locale === "ee_gh" },
                        { key: "locale:kpo_gh", value: "Ikposo", defaultValue: loggedInUser?.locale === "kpo_gh" },
                    ]}
                    filters2={[{ key: "is_accepted:1", value: "Accepted" },
                    { key: "transcription_status:pending", value: "Pending" },
                    { key: "transcription_status:conflict", value: "Conflict" },
                    ]}
                    bulkActions={[
                        { name: "Approve Selected", action: (bulkSelectedIds) => handleBulImageAction(bulkSelectedIds, "approve") },
                        { name: "Reject Selected", action: (bulkSelectedIds) => handleBulImageAction(bulkSelectedIds, "reject") },
                    ]}
                    headers={[{
                        key: "audio_url", value: "Audio", render: (item) => {
                            return (
                                <div className="d-flex align-items-center">
                                    <TextOverflow text={item.audio_url} width={30} />
                                    {item.is_accepted ?
                                        <span className='ms-2 p-0 badge bg-success'><i className="bi bi-info-circle"></i></span>
                                        :
                                        <span className='ms-2 p-0 badge bg-warning'><i className="bi bi-info-circle"></i></span>
                                    }
                                </div>
                            )
                        }
                    }, {
                        key: "locale", value: "Locale"
                    },
                    {
                        key: "image_url", value: "Image", render: (item) => {
                            return (
                                <div>
                                    <img src={item.thumbnail} alt={item.image_url} className="profile-image" onClick={() => showEditTranscriptionModal(item)} />
                                </div>
                            )
                        }
                    }, {
                        value: "Actions", render: (item) => {
                            return (
                                <div className="d-flex">
                                    <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showEditTranscriptionModal(item)}>
                                        <i className="bi bi-list me-1"></i>
                                        More
                                    </button>
                                </div>
                            )
                        }
                    }]}
                >
                </TableView>
            </div>
        </Fragment >
    );
}

export default TranscriptionsTable;
