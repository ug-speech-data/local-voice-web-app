import './style.scss';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Modal } from 'bootstrap';
import { Spinner, useToast } from '@chakra-ui/react';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';
import PageMeta from '../../components/PageMeta';
import SelectInput from '../../components/SelectInput';


function OthersPayment() {
    const { trigger: sendDisbursementRequest, data: response, error: errorSendingRequest, isLoading } = useAxios({ method: "POST" });

    const confirmationModalRef = useRef(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    const toast = useToast()

    // Form input
    const [fullname, setFullname] = useState('');
    const [amount, setAmount] = useState(0);
    const [network, setNetwork] = useState('');
    const [momoNumber, setMomoNumber] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (confirmationModalRef.current !== null && confirmationModal === null) {
            const modal = new Modal(confirmationModalRef.current)
            setConfirmationModal(modal)
        }
    }, [])


    function showPaymentConfirmation(event) {
        event.preventDefault()
        confirmationModal?.show()
    }

    const handleSendRequest = async (e) => {
        if (!(fullname && amount, network, momoNumber)) {
            alert("Choose complete all fields.")
        } else {
            const body = {
                fullname,
                amount,
                momo_number: momoNumber,
                note,
                network
            }
            sendDisbursementRequest(
                `${BASE_API_URI}/payments/pay-ungresiter-user/`,
                body
            )
        }
    }


    // Update error
    useEffect(() => {
        if (Boolean(errorSendingRequest) && !isLoading) {
            toast.close("send")
            toast({
                id: "send",
                position: 'top-center',
                title: `An error occurred`,
                description: errorSendingRequest,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorSendingRequest, isLoading])

    useEffect(() => {
        if (Boolean(response?.message)) {
            toast.close("response")
            toast({
                id: "response",
                position: 'top-center',
                title: `Info`,
                description: response?.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
        }
        confirmationModal?.hide()
        resetForm()
    }, [response, isLoading])

    function resetForm() {
        setMomoNumber("")
        setAmount("")
        setNetwork("")
        setFullname("")
        setNote("")
    }


    return (
        <Fragment>
            <PageMeta title="Participants Payment | UG Speech Data" />
            <div ref={confirmationModalRef} className="modal fade" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-mg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Confirm Payment
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group my-3">
                                <p className='h6 text-center'>Please confirm disbursement of GHC{amount} to {fullname} ({momoNumber}).</p>
                                <div className="my-3 d-flex justify-content-center">
                                    <button className="btn btn-sm d-flex align-items-center btn-primary"
                                        disabled={isLoading}
                                        onClick={() => handleSendRequest()}
                                    >
                                        {isLoading && <span className="mx-2"><Spinner /></span>} Send
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

            <div className="mb-5 overflow-scroll">
                <form className="col-md-4 mx-auto my-4" onSubmit={showPaymentConfirmation}>
                    <h4 className='text-center'>PAY UNREGISTERED USERS</h4>
                    <div className="form-group">
                        <label htmlFor="momo">Momo Number</label>
                        <input type="text" pattern='0[2-9][0-9]{8}' value={momoNumber} onChange={(event) => setMomoNumber(event.target.value)} className="form-control" id="momo" placeholder="Enter momo" required minLength={10} maxLength={10} />
                    </div>

                    <div className="form-group my-3">
                        <label htmlFor="fullname">Full Name</label>
                        <input type="text" value={fullname} onChange={(event) => setFullname(event.target.value)} className="form-control" id="fullname" placeholder="Enter fullname" required />
                    </div>

                    <div className="form-group my-3">
                        <label htmlFor="amount">Amount</label>
                        <input type="number" step="0.2" value={amount} onChange={(event) => setAmount(event.target.value)} min={1} className="form-control" id="amount" placeholder="Enter amount" required />
                    </div>

                    <SelectInput
                        onChange={(e) => setNetwork(e.target.value)}
                        required={true}
                        value={network}
                        options={[
                            { value: "", label: 'Choose network' },
                            { value: 'MTN', label: 'MTN' },
                            { value: 'VODAFONE', label: 'VODAFONE' },
                            { value: 'AIRTELTIGO', label: 'AIRTELTIGO' },
                        ]}
                    />

                    <div className="form-group my-3">
                        <label htmlFor="note">Note</label>
                        <textarea className='form-control' value={note} onChange={(e) => setNote(e.target.value)} id='note' name='note'></textarea>
                    </div>

                    <div className="form-group my-3">
                        <p className="text-center"><button className='btn btn-primary'>Pay <i className="bi bi-send"></i></button></p>
                    </div>
                </form>
            </div>
        </Fragment >
    );
}

export default OthersPayment;
