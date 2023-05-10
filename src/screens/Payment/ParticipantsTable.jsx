import './style.scss';
import TableView from '../../components/Table';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Modal } from 'bootstrap';
import {
    useDeleteParticipantsMutation,
    useUpdateParticipantsMutation,
} from '../../features/resources/resources-api-slice';
import { Spinner, useToast } from '@chakra-ui/react';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';
import PageMeta from '../../components/PageMeta';
import { Link } from 'react-router-dom';


function ParticipantsTable() {
    const [triggerReload, setTriggerReload] = useState(0);
    const [deleteParticipant, { isLoading: isDeletingParticipant, error: errorDeletingParticipant }] = useDeleteParticipantsMutation()
    const [putParticipant, { isLoading: isPuttingParticipant, isSuccess: successPuttingParticipant, error: errorPuttingParticipant }] = useUpdateParticipantsMutation()

    const deletionModalRef = useRef(null);
    const confirmationModalRef = useRef(null);
    const editParticipantModalRef = useRef(null);
    const toast = useToast()

    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [editParticipantModal, setEditParticipantModal] = useState(null);
    const [newUpdate, setNewUpdate] = useState(null);
    const [selectedIds, setSelectedIds] = useState([])
    const [totalToPay, setTotalToPay] = useState(0)

    // Form input
    const [fullname, setFullname] = useState('');
    const [amount, setAmount] = useState(0);
    const [network, setNetwork] = useState('');
    const [momoNumber, setMomoNumber] = useState('');
    const [flatten, setFlatten] = useState(null);

    useEffect(() => {
        if (editParticipantModalRef.current !== null && editParticipantModal === null) {
            const modal = new Modal(editParticipantModalRef.current)
            setEditParticipantModal(modal)
        }
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }
        if (confirmationModalRef.current !== null && confirmationModal === null) {
            const modal = new Modal(confirmationModalRef.current)
            setConfirmationModal(modal)
        }
    }, [])

    const handleDeleteParticipant = async () => {
        if (selectedParticipant === null) {
            return
        }
        const response = await deleteParticipant({ id: selectedParticipant.id }).unwrap()
        const errorMessage = response["error_message"]
        if ((errorMessage !== undefined) || (errorMessage !== null)) {
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

    useEffect(() => {
        if (selectedParticipant) {
            setFullname(selectedParticipant.fullname)
            setAmount(selectedParticipant?.amount || 0)
            setNetwork(selectedParticipant?.network || "")
            setMomoNumber(selectedParticipant.momo_number)
            setFlatten(selectedParticipant.flatten)
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
            flatten: flatten,
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
        toast.close("submitting")
    }, [successPuttingParticipant])

    // Bulk actions
    const { trigger: executeBulkParticipantAction, data: bulkActionResponseData, error: bulkActionError, isLoading: isSubmittingBulkAction } = useAxios({ method: "POST" })
    function handleBulkParticipantAction(action, ids) {
        toast.close("submitting")
        toast({
            id: "submitting",
            title: `Executing actions for ${selectedIds.length} audios`,
            status: "info",
            position: "top-center",
            duration: null,
            isClosable: true,
        })
        executeBulkParticipantAction(
            `${BASE_API_URI}/participants-bulk-actions/`,
            { ids: ids, action: action }
        )
    }

    function showBulkPayConfirmationModal(bulkSelectedIds) {
        setSelectedIds(bulkSelectedIds)
        confirmationModal?.show()
    }

    useEffect(() => {
        toast.close("submitting")
        if (bulkActionResponseData?.message) {
            toast({
                title: `Submitted`,
                description: bulkActionResponseData?.message,
                status: "info",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
        confirmationModal?.hide()
        setTotalToPay(0)
        setTriggerReload((triggerReload) => triggerReload + 1);
    }, [bulkActionResponseData])


    useEffect(() => {
        toast.close("submitting")
        if (bulkActionError && !isSubmittingBulkAction) {
            toast({
                title: `Error`,
                description: bulkActionError,
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [bulkActionError, isSubmittingBulkAction])


    function showDeleteParticipantModal(item) {
        setSelectedParticipant(item)
        deleteAlertModal?.show()
    }

    return (
        <Fragment>
            <PageMeta title="Participants Payment | Local Voice" />
            <div ref={confirmationModalRef} className="modal fade" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-mg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Pay all selected users
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group my-3">
                                <p className='h6 text-center'>Continue to pay every selected user?</p>
                                <p className="text text-center">Total Amount: <span className="badge bg-primary">GHC {totalToPay}</span></p>
                                <div className="my-3 d-flex justify-content-center">
                                    <button className="btn btn-primary"
                                        disabled={isSubmittingBulkAction}
                                        onClick={() => handleBulkParticipantAction("pay", selectedIds)}
                                    >
                                        {isSubmittingBulkAction && <span className="mx-2"><Spinner /></span>}
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

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
                <div className="modal-dialog modal-lg">
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

                                <div className="row align-items-center">
                                    <div className="my-3 col-md-8">
                                        <label htmlFor="name" className="form-label"><b>Amount</b></label>
                                        <input type="number" className="form-control" id="name" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                    </div>
                                    <div className="my-3 col-md-4">
                                        <label htmlFor="flatten" className="form-label m-0"><b>Flatten <i className="bi bi-info-circle" title='This amount will not be updated again to reflect the number of audios.'></i></b></label>
                                        <br />
                                        <input type="checkbox" className="form-check-input" onChange={(e) => setFlatten(e.target.checked)} checked={flatten} />
                                    </div>
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
                                        <option value="VODAFONE" >VODAFONE</option>
                                        <option value="AIRTELTIGO" >AIRTELTIGO</option>
                                    </select>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Date</b></label>
                                    <p>{selectedParticipant?.created_at}</p>
                                </div>
                                <div className="my-3">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Transaction ID</th>
                                                <th>Phone</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {console.log(selectedParticipant?.transactions)}
                                            {selectedParticipant?.transactions?.map(transaction =>
                                                <tr>
                                                    <td>{transaction.transaction_id}</td>
                                                    <td>{transaction.phone_number}</td>
                                                    <td>{transaction.amount}</td>
                                                    <td>
                                                        {transaction?.status === "pending" ?
                                                            <span className='badge bg-warning'>{transaction?.status}</span> :
                                                            transaction?.status === "success" ?
                                                                <span className='badge bg-success'>{transaction?.status}</span> :
                                                                transaction?.status === "new" ?
                                                                    <span className='badge bg-primary'>{transaction?.status}</span> :
                                                                    <span className='badge bg-danger'>{transaction?.status}</span>}

                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
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

            <div className="mb-5 overflow-scroll">
                <TableView
                    reloadTrigger={triggerReload}
                    responseDataAttribute="participants"
                    dataSourceUrl={`${BASE_API_URI}/collected-participants/`}
                    newUpdate={newUpdate}
                    filters={[
                        { key: "type:ASSISTED", value: "Assisted Participants" },
                        { key: "type:INDEPENDENT", value: "Independent Participants" },
                    ]}
                    filters2={[
                        { key: "balance__gt:0", value: "Has balance", defaultValue: true },
                        { key: "transaction__status:pending", value: "Pending transactions" },
                        { key: "transaction__status:failed", value: "Failed transactions" },
                        { key: "transaction__status:success", value: "Successful transactions" },
                        { key: "transaction__status:new", value: "New transactions" },
                    ]}
                    bulkActions={[
                        {
                            name: "Pay selected", action: (bulkSelectedIds, selectedItems) => {
                                let total = 0
                                selectedItems.forEach(participant => {
                                    total += Number.parseFloat(participant.amount)
                                });
                                setTotalToPay(total.toFixed(2))
                                showBulkPayConfirmationModal(bulkSelectedIds)
                            }
                        },
                        {
                            name: "Check status of selected", action: (bulkSelectedIds) => {
                                setSelectedIds(bulkSelectedIds)
                                handleBulkParticipantAction("payment_status_check", bulkSelectedIds)
                            }
                        },
                    ]}
                    headers={[{
                        key: "fullname", value: "Name",

                    }, {
                        key: "momo_number", value: "Momo Number", render: (item) => {
                            return (
                                <Link to={`/collected-data?query=${item.momo_number}`}
                                    className="text-primary">{item.momo_number}</Link>
                            )
                        }
                    }, {
                        key: "type", value: "Type"
                    },
                    {
                        key: "locale", value: "Locale"
                    }, {
                        key: "audio_count", value: "Audios"
                    }, {
                        key: "audios_validated", value: "% Val."
                    },
                    {
                        key: "percentage_audios_accepted", value: "% ACC."
                    }, {
                        key: "amount", value: "Amt. (₵)"
                    }, {
                        key: "balance", value: "Bal."
                    }, {
                        key: "paid", value: "Payment", render: (item) => {
                            return (
                                <Fragment>
                                    <span>
                                        {item?.balance > 0 ?
                                            <span className='badge bg-warning'>Pending</span> :
                                            <span className='badge bg-success'>No Balance</span>
                                        }
                                    </span>
                                    <br />
                                    {item?.transactions?.length > 0 ? <span className="badge bg-primary p-1 m-0">previous: {item?.transactions?.length}</span> : ""}
                                </Fragment>
                            )
                        }
                    },
                    {
                        value: "Actions", render: (item) => {
                            return (
                                <div className="d-flex">
                                    <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showEditParticipantModal(item)}>
                                        <i className="bi bi-list me-1"></i>
                                        More
                                    </button>

                                    <button className="btn btn-sm btn-outline-danger me-1 d-flex" onClick={() => showDeleteParticipantModal(item)}>
                                        <i className="bi bi-list me-1"></i>
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
