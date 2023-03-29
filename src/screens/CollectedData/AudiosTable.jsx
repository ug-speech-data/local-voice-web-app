import './style.scss';
import TableView from '../../components/Table';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Modal } from 'bootstrap';
import {
    useDeleteAudiosMutation,
    useUpdateAudiosMutation,
} from '../../features/resources/resources-api-slice';
import { Spinner, useToast } from '@chakra-ui/react';
import TextOverflow from '../../components/TextOverflow';
import { BASE_API_URI } from '../../utils/constants';
import AudioPlayer from "../../components/AudioPlayer";
import useAxios from '../../app/hooks/useAxios';
import PageMeta from '../../components/PageMeta';


function AudiosTable() {
    const [triggerReload, setTriggerReload] = useState(0);

    const [deleteAudio, { isLoading: isDeletingAudio, error: errorDeletingAudio }] = useDeleteAudiosMutation()
    const [putAudio, { isLoading: isPuttingAudio, isSuccess: successPuttingAudio, error: errorPuttingAudio }] = useUpdateAudiosMutation()

    const { trigger: getEnumerators, data: enumeratorResponse, error: errorGettingEnumerators, isLoading: gettingEnumerators } = useAxios({ mainUrl: BASE_API_URI + '/get-enumerators/' })

    const deletionModalRef = useRef(null);
    const editAudioModalRef = useRef(null);
    const toast = useToast()

    const [selectedAudio, setSelectedAudio] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [editAudioModal, setEditAudioModal] = useState(null);
    const [newUpdate, setNewUpdate] = useState(null);
    const [isAudioBuffering, setIsAudioBuffering] = useState(true)
    const [enumerators, setEnumerators] = useState([])

    // Form input
    const [name, setName] = useState('');

    useEffect(() => {
        if (editAudioModalRef.current !== null && editAudioModal === null) {
            const modal = new Modal(editAudioModalRef.current)
            setEditAudioModal(modal)
        }
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }
    }, [])

    const handleDeleteAudio = async () => {
        if (selectedAudio === null) {
            return
        }
        const response = await deleteAudio({ id: selectedAudio.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            setNewUpdate({ item: selectedAudio, action: "remove" })
            toast({
                position: 'top-center',
                title: `Success`,
                description: "Audio deleted successfully",
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

    const showEditAudioModal = (image) => {
        setSelectedAudio(image)
        editAudioModal?.show()
    }

    const showDeleteAudioModal = (image) => {
        setSelectedAudio(image)
        deleteAlertModal?.show()
    }

    useEffect(() => {
        if (selectedAudio) {
            setName(selectedAudio.name)
        }
    }, [selectedAudio])

    const handleSubmission = async (status) => {
        if (selectedAudio === null) {
            return
        }
        const body = {
            name,
            id: selectedAudio.id,
            status: status,
        }
        const response = await putAudio(body).unwrap()
        if (response?.audio !== undefined) {
            setTriggerReload((triggerReload) => triggerReload + 1);
        }
    }

    useEffect(() => {
        if (errorPuttingAudio) {
            toast({
                title: `Error: ${errorPuttingAudio.status}`,
                description: "An error occurred while updating the image",
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
        if (errorDeletingAudio) {
            toast({
                title: `Error: ${errorDeletingAudio.status}`,
                description: "An error occurred while deleting the image",
                position: "top-center",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingAudio, errorDeletingAudio])

    useEffect(() => {
        if (successPuttingAudio) {
            toast({
                title: "Success",
                description: "Audio updated successfully",
                position: "top-center",
                status: "success",
                duration: 2000,
                isClosable: true,
            })
            editAudioModal?.hide()
        }
    }, [successPuttingAudio])


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
            `${BASE_API_URI}/audios-bulk-actions/`,
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
        setTriggerReload((triggerReload) => triggerReload + 1);
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

    // Getting enumerators
    useEffect(() => {
        getEnumerators()
    }, [])

    useEffect(() => {
        if (Boolean(enumeratorResponse?.enumerators)) {
            setEnumerators(enumeratorResponse.enumerators)
        }
    }, [enumeratorResponse])


    return (
        <Fragment>
            <PageMeta title="Collected Audios | Local Voice" />

            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Audio - '{selectedAudio?.name}'
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
                                {isDeletingAudio && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteAudio(selectedAudio)} >Yes, continue</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={editAudioModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedAudio ? "Edit Audio" : "New Audio"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body row">
                            <div className="col-md-6 mx-auto">
                                <div className="d-flex justify-content-center align-items-center">
                                    <img src={selectedAudio?.image_url} alt={selectedAudio?.name} />
                                </div>
                            </div>

                            <div className="col-md-6 mx-auto">
                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>File ({selectedAudio?.id})</b></label>
                                    <a href={selectedAudio?.audio_url} target="_blank">{selectedAudio?.audio_url}</a>
                                </div>
                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Batch Number</b></label>
                                    <p>{selectedAudio?.image_batch_number}</p>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Device</b></label>
                                    <p>{selectedAudio?.device_id}</p>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Participant's Phone</b></label>
                                    <p>{selectedAudio?.participant_phone}</p>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Date</b></label>
                                    <p>{selectedAudio?.created_at}</p>
                                </div>

                                <div className="d-flex align-items-center" style={{ overflow: "auto" }}>
                                    <AudioPlayer
                                        canSeek={true}
                                        src={selectedAudio?.audio_url}
                                        setIsAudioBuffering={setIsAudioBuffering} />

                                    {selectedAudio && isAudioBuffering && <Spinner
                                        thickness='4px'
                                        speed='0.65s'
                                        emptyColor='gray.200'
                                        size="md"
                                        color='purple.500'
                                    />}
                                </div>

                                <div className='my-3'>
                                    <h6 className='h6'>Reject/Approval</h6>
                                    <div className="d-flex">
                                        <button className="me-5 btn btn-sm btn-success" onClick={() => {
                                            handleSubmission("accept");
                                        }}>Accept</button>
                                        <button className="ms-5 btn btn-sm btn-outline-danger"
                                            onClick={() => {
                                                handleSubmission("reject");
                                            }}
                                        >Reject</button>
                                    </div>
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
                    reloadTrigger={triggerReload}
                    responseDataAttribute="audios"
                    dataSourceUrl={`${BASE_API_URI}/collected-audios/`}
                    newUpdate={newUpdate}
                    filters={[
                        { key: "locale:ak_gh", value: "Akan" },
                        { key: "locale:dga_gh", value: "Dagbani" },
                        { key: "locale:dag_gh", value: "Dagaare" },
                        { key: "locale:ee_gh", value: "Ewe" },
                        { key: "locale:kpo_gh", value: "Ikposo" },
                        { value: "---------------------" },
                        ...(enumerators?.map(enumerator => { return { key: `submitted_by__id:${enumerator.id}`, value: `${enumerator.fullname}` } }) || []).sort()
                    ]}
                    filters2={[
                        { key: "is_accepted:1", value: "Accepted" },
                        { key: "is_accepted:0", value: "Pending" },
                        { key: "rejected:1", value: "Rejected" },
                        { key: "is_accepted:0:validations", value: "Validation Conflict" },
                    ]}
                    bulkActions={[
                        { name: "Approve selected", action: (bulkSelectedIds) => handleBulImageAction(bulkSelectedIds, "approve") },
                        { name: "Reject selected", action: (bulkSelectedIds) => handleBulImageAction(bulkSelectedIds, "reject") },
                    ]}
                    headers={[{
                        key: "name", value: "Name", render: (item) => {
                            return (
                                <div>
                                    <div className="d-flex align-items-center">
                                        <TextOverflow text={item.name} width={10} />
                                        {item.is_accepted ?
                                            (<span className='ms-2 p-0 badge bg-success'><i className="bi bi-info-circle"></i></span>)
                                            :
                                            item.rejected ?
                                                (<span className='ms-2 p-0 badge bg-danger'><i className="bi bi-info-circle" ></i></span>)
                                                :
                                                (<span className='ms-2 p-0 badge bg-warning'><i className="bi bi-info-circle" ></i></span>)
                                        }
                                    </div>
                                </div>
                            )
                        }
                    },
                    {
                        key: "duration", value: "Player", render: (item) => {
                            return (
                                <AudioPlayer
                                    src={item?.audio_url}
                                    canSeek={true}
                                    setIsAudioBuffering={setIsAudioBuffering} />
                            )
                        }
                    },
                    {
                        key: "locale", value: "Locale"
                    }, {
                        key: "environment", value: "Environment"
                    },

                    {
                        key: "device_id", value: "Device", render: (item) => {
                            return (
                                <TextOverflow text={item.device_id} width={10} />
                            )
                        }
                    },

                    {
                        key: "submitted_by", value: "User"
                    }, {
                        key: "image_url", value: "Image", render: (item) => {
                            return (
                                <div>
                                    <img src={item.thumbnail} alt={item.name} className="profile-image" onClick={() => showEditAudioModal(item)} />
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
                                    <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showEditAudioModal(item)}>
                                        <i className="bi bi-list me-1"></i>
                                        More
                                    </button>
                                    <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeleteAudioModal(item)}>
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

export default AudiosTable;
