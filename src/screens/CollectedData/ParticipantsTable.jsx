import './style.scss';
import TableView from '../../components/Table';
import { Fragment, useRef, useState, useEffect, memo } from 'react';
import { Modal } from 'bootstrap';
import {
    useDeleteParticipantsMutation,
    useUpdateParticipantsMutation,
} from '../../features/resources/resources-api-slice';
import { Spinner, useToast } from '@chakra-ui/react';
import { BASE_API_URI } from '../../utils/constants';


function ParticipantsTable() {
    const [deleteParticipant, { isLoading: isDeletingParticipant, error: errorDeletingParticipant }] = useDeleteParticipantsMutation()
    const [putParticipant, { isLoading: isPuttingParticipant, isSuccess: successPuttingParticipant, error: errorPuttingParticipant }] = useUpdateParticipantsMutation()


    const deletionModalRef = useRef(null);
    const editParticipantModalRef = useRef(null);
    const toast = useToast()

    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [editParticipantModal, setEditParticipantModal] = useState(null);
    const [newUpdate, setNewUpdate] = useState(null);

    // Form input
    const [fullname, setFullname] = useState('');
    const [amount, setAmount] = useState(0);
    const [network, setNetwork] = useState('');
    const [momoNumber, setMomoNumber] = useState('');

    useEffect(() => {
        if (editParticipantModalRef.current !== null && editParticipantModal === null) {
            const modal = new Modal(editParticipantModalRef.current)
            setEditParticipantModal(modal)
        }
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }
    }, [])

    const handleDeleteParticipant = async () => {
        if (selectedParticipant === null) {
            return
        }
        const response = await deleteParticipant({ id: selectedParticipant.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            setNewUpdate({ item: selectedParticipant, action: "remove" })
            toast({
                position: 'top-center',
                title: `Success`,
                description: "Participant deleted successfully",
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

    const showEditParticipantModal = (image) => {
        setSelectedParticipant(image)
        editParticipantModal?.show()
    }

    const showDeleteParticipantModal = (image) => {
        setSelectedParticipant(image)
        deleteAlertModal?.show()
    }

    useEffect(() => {
        if (selectedParticipant) {
            setFullname(selectedParticipant.fullname)
            setAmount(selectedParticipant?.amount || 0)
            setNetwork(selectedParticipant?.network || "")
            setMomoNumber(selectedParticipant.momo_number)
        }
    }, [selectedParticipant])

    const handleSubmission = async () => {
        if (selectedParticipant === null) {
            return
        }
        const body = {
            fullname: fullname,
            momo_number: momoNumber,
            amount: amount,
            network: network,
            id: selectedParticipant?.id || -1,
        }
        const response = await putParticipant(body).unwrap()
        if (response?.transcription !== undefined) {
            setNewUpdate({ item: response.transcription, action: "update" })
        }
    }

    useEffect(() => {
        if (errorPuttingParticipant) {
            toast({
                title: `Error: ${errorPuttingParticipant.status}`,
                description: "An error occurred while updating the image",
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
        if (errorDeletingParticipant) {
            toast({
                title: `Error: ${errorDeletingParticipant.status}`,
                description: "An error occurred while deleting the image",
                position: "top-center",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingParticipant, errorDeletingParticipant])

    useEffect(() => {
        if (successPuttingParticipant) {
            toast({
                title: "Success",
                description: "Participant updated successfully",
                position: "top-center",
                status: "success",
                duration: 2000,
                isClosable: true,
            })
            editParticipantModal?.hide()
        }
    }, [successPuttingParticipant])


    return (
        <Fragment>
            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Participant - '{selectedParticipant?.fullname}'
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
                                {isDeletingParticipant && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteParticipant(selectedParticipant)} >Yes, continue</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={editParticipantModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedParticipant ? "Edit Participant" : "New Participant"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body row">
                            <div className="col-md-10 mx-auto">
                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Full Name</b></label>
                                    <input type="text" className="form-control" id="name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Amount</b></label>
                                    <input type="number" className="form-control" id="name" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Phone Number</b></label>
                                    <input type="text" className="form-control" id="name" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} />
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Network</b></label>
                                    <select name="" id="" className="form form-select"
                                        value={network} onChange={(e) => setNetwork(e.target.value)}>
                                        <option value="">None</option>
                                        <option value="MTN" >MTN</option>
                                        <option value="VOD" >VODAFONE</option>
                                        <option value="TIG" >AIRTEL TIGO</option>
                                    </select>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Status</b></label>
                                    <p>
                                        {selectedParticipant?.transaction === null && <span className="badge bg-warning">No transaction</span>}
                                        <span className='badge bg-primary'>{selectedParticipant?.transaction?.status}</span>
                                    </p>
                                </div>

                                <div className="my-3 d-flex justify-content-end">
                                    <button className="btn btn-primary btn-sm"
                                        disabled={isPuttingParticipant}
                                        onClick={handleSubmission}>{isPuttingParticipant && <Spinner />} Save Changes</button>
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
                    responseDataAttribute="participants"
                    dataSourceUrl={`${BASE_API_URI}/collected-participants/`}
                    newUpdate={newUpdate}
                    filters={[{ key: "paid:0", value: "Not paid" }, { key: "paid:1", value: "Paid" }]}
                    bulkActions={[
                        { name: "Pay selected", action: () => alert("paid") },
                        { name: "Check Status of selected", action: () => alert("paid") },
                    ]}
                    headers={[{
                        key: "fullname", value: "Name",

                    }, {
                        key: "momo_number", value: "Momo Number"
                    }, {
                        key: "gender", value: "Gender"
                    }, {
                        key: "audio_count", value: "Audios"
                    }, {
                        key: "amount", value: "Amount (GHC)"
                    }, {
                        key: "paid", value: "Paid", render: (item) => {
                            return (
                                <span className={item.paid ? 'badge bg-success' : 'badge bg-danger'}>{item.paid ? "Yes" : "No"}</span>
                            )
                        }
                    },
                    {
                        value: "Actions", render: (item) => {
                            return (
                                <div className="d-flex">
                                    <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showEditParticipantModal(item)}>
                                        <i className="bi bi-list me-1"></i>
                                        More
                                    </button>
                                    <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeleteParticipantModal(item)}>
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

export default ParticipantsTable;
