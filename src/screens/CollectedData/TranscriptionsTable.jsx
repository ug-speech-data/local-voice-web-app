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
import ToolTip from '../../components/ToolTip';
import { BASE_API_URI } from '../../utils/constants';
import AudioPlayer from "../../components/AudioPlayer";
import useAxios from '../../app/hooks/useAxios';
import PageMeta from '../../components/PageMeta';


function TranscriptionsTable() {
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
                                Delete Transcription - '{selectedTranscription?.audio.name}'
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
                                {selectedTranscription ? "Edit Transcription" : "New Transcription"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body row">
                            <div className="col-md-6 mx-auto">
                                <div className="d-flex justify-content-center align-items-center">
                                    <img src={selectedTranscription?.audio.image_url} alt={selectedTranscription?.audio.name} />
                                </div>
                            </div>

                            <div className="col-md-6 mx-auto">
                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Text</b></label>
                                    <p className="text-justify">{selectedTranscription?.text}</p>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Locale</b></label>
                                    <p className="text-justify">{selectedTranscription?.audio.locale}</p>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Audio</b></label>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <AudioPlayer
                                            src={selectedTranscription?.audio.audio_url}
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
                                    <label htmlFor="name" className="form-label"><b>Validations</b></label>
                                    <div>
                                        {selectedTranscription?.validations?.map((validation, valIndex) => (
                                            <span key={valIndex} className={validation.is_valid ? 'badge bg-primary' : 'badge bg-warning'}>{validation.user}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label me-2">Accepted</label>
                                    <input type="checkbox" className="form-check-input"
                                        onChange={() => setIsAccepted(!isAccepted)}
                                        checked={isAccepted} />
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


            <div className="my-5 overflow-scroll">
                <TableView
                    responseDataAttribute="transcriptions"
                    dataSourceUrl={`${BASE_API_URI}/collected-transcriptions/`}
                    newUpdate={newUpdate}
                    filters={[{ key: "is_accepted:1", value: "Accepted" }, { key: "is_accepted:0", value: "Pending" }]}
                    bulkActions={[
                        { name: "Approve Selected", action: (bulkSelectedIds) => handleBulImageAction(bulkSelectedIds, "approve") },
                        { name: "Reject Selected", action: (bulkSelectedIds) => handleBulImageAction(bulkSelectedIds, "reject") },
                    ]}
                    headers={[{
                        key: "name", value: "Audio", render: (item) => {
                            return (
                                <div className="d-flex align-items-center">
                                    <TextOverflow text={item.audio.name} width={30} />
                                    {item.is_accepted ?
                                        <ToolTip title="Add Transcription" header={
                                            (<span className='ms-2 p-0 badge bg-success'><i className="bi bi-info-circle"></i></span>)
                                        }>
                                            Transcription has be approved. Click on more to view more details.
                                        </ToolTip>
                                        :
                                        <ToolTip title="Add Transcription" header={
                                            (<span className='ms-2 p-0 badge bg-warning'><i className="bi bi-info-circle"></i></span>)
                                        }>
                                            This transcription is pending approval. Click on more to view more details.
                                        </ToolTip>
                                    }
                                </div>
                            )
                        }
                    }, {
                        key: "submitted_by", value: "User"
                    }, {
                        key: "image_url", value: "Image", render: (item) => {
                            return (
                                <div>
                                    <img src={item.audio.thumbnail} alt={item.audio.name} className="profile-image" onClick={() => showEditTranscriptionModal(item)} />
                                </div>
                            )
                        }
                    }, {
                        key: "validations", value: "Validations", render: (item) => {
                            return (
                                <div>
                                    {item.validations?.map((validation, valIndex) => (
                                        <span key={valIndex} className={validation.is_valid ? 'badge bg-primary' : 'badge bg-warning'}>{validation.user}</span>
                                    ))}
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
                                    <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeleteTranscriptionModal(item)}>
                                        <i className="bi bi-trash me-1"></i>
                                        Delete
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
