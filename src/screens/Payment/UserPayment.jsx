import React, { useState, useRef, useEffect } from 'react'
import {
    useLazyGetGroupsQuery,
} from '../../features/resources/resources-api-slice';
import TableView from '../../components/Table';
import { Fragment } from "react";
import { Modal } from 'bootstrap';
import PageMeta from '../../components/PageMeta';
import { Spinner, useToast } from '@chakra-ui/react';
import useAxios from '../../app/hooks/useAxios';
import { BASE_API_URI } from '../../utils/constants';


function UserPayment() {
    const [triggerReload, setTriggerReload] = useState(0);
    const [getGroups, { data: response = [], isFetching, error }] = useLazyGetGroupsQuery()
    const { trigger: executeCreditAction, data: creditResponseData, error: creditError, isLoading: isCrediting } = useAxios({ method: "POST" })
    const { trigger: executePaymentAction, data: paymentResponseData, error: paymentError, isLoading: isPaying } = useAxios({ method: "POST" })
    const { trigger: executeBalancePaymentAction, data: balancePaymentResponseData, error: balancePaymentError, isLoading: isPayingBalance } = useAxios({ method: "POST" })
    const { trigger: executeValidationBenefitAction, data: validationBenefitResponseData, error: validationBenefitError, isLoading: isPayingValidation } = useAxios({ method: "POST" })

    const [groups, setGroups] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [totalToPay, setTotalToPay] = useState(0)

    const creditModalRef = useRef(null);
    const paymentModalRef = useRef(null);
    const paymentBalanceModalRef = useRef(null);
    const paymentValidationModalRef = useRef(null);
    const [paymentAmount, setPaymentAmount] = useState(0)

    const [creditModal, setCreditModal] = useState(null)
    const [paymentModal, setPaymentModal] = useState(null)
    const [balancePaymentModal, setBalancePaymentModal] = useState(null)
    const [validationBenefitModal, setValidationBenefitModal] = useState(null)


    // HACK: negative numbers are added to the total payout
    const [sign, setSign] = useState(1)


    const toast = useToast()

    useEffect(() => {
        setGroups(response["groups"])
    }, [isFetching])

    useEffect(() => {
        getGroups()
    }, [])

    useEffect(() => {
        if (creditModalRef.current !== null && creditModal === null) {
            const modal = new Modal(creditModalRef.current, { keyboard: false })
            setCreditModal(modal)
        }
        if (paymentModalRef.current !== null && paymentModal === null) {
            const modal = new Modal(paymentModalRef.current, { keyboard: false })
            setPaymentModal(modal)
        }
        if (paymentBalanceModalRef.current !== null && balancePaymentModal === null) {
            const modal = new Modal(paymentBalanceModalRef.current, { keyboard: false })
            setBalancePaymentModal(modal)
        }
        if (paymentValidationModalRef.current !== null && validationBenefitModal === null) {
            const modal = new Modal(paymentValidationModalRef.current, { keyboard: false })
            setValidationBenefitModal(modal)
        }
    }, [])

    // Crediting users
    const [creditAmount, setCreditAmount] = useState(0)
    useEffect(() => {
        if (creditResponseData?.message) {
            toast({
                position: 'top-center',
                title: `Info`,
                description: creditResponseData.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
            creditModal?.hide()
            setTriggerReload((triggerReload) => triggerReload + 1);
        }
    }, [creditResponseData])

    useEffect(() => {
        if (creditError && !isCrediting) {
            toast({
                position: 'top-center',
                title: `Error`,
                description: creditError,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [creditError, isCrediting])

    useEffect(() => {
        if (validationBenefitError && !isPayingValidation) {
            toast({
                position: 'top-center',
                title: `Error`,
                description: validationBenefitError,
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }
    }, [validationBenefitError, isPayingValidation])

    const showCreditModal = (bulkSelectedIds) => {
        setSelectedIds(bulkSelectedIds)
        setCreditAmount(0)
        creditModal?.show()
    }
    function handleCreditSubmission() {
        executeCreditAction(
            `${BASE_API_URI}/payments/credit-users/`,
            { ids: selectedIds, amount: sign * creditAmount }
        )
    }

    // Paying users
    useEffect(() => {
        if (paymentResponseData?.message) {
            toast({
                position: 'top-center',
                title: `Info`,
                description: paymentResponseData.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
            paymentModal?.hide()
        }
    }, [paymentResponseData])

    useEffect(() => {
        if (validationBenefitResponseData?.message) {
            toast({
                position: 'top-center',
                title: `Info`,
                description: validationBenefitResponseData.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
            paymentModal?.hide()
        }
    }, [validationBenefitResponseData])

    useEffect(() => {
        if (paymentError && !isPaying) {
            toast({
                position: 'top-center',
                title: `Error`,
                description: paymentError,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [paymentError, isPaying])

    const showPaymentModal = (bulkSelectedIds) => {
        setSelectedIds(bulkSelectedIds)
        setPaymentAmount(0)
        paymentModal?.show()
    }
    function handlePaymentSubmission() {
        executePaymentAction(
            `${BASE_API_URI}/payments/pay-users/`,
            { ids: selectedIds, amount: paymentAmount }
        )
    }

    // Pay Balance
    useEffect(() => {
        if (balancePaymentResponseData?.message) {
            toast({
                position: 'top-center',
                title: `Info`,
                description: balancePaymentResponseData.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
            balancePaymentModal?.hide()
        }
    }, [balancePaymentResponseData])

    useEffect(() => {
        if (balancePaymentError && !isPayingBalance) {
            toast({
                position: 'top-center',
                title: `Error`,
                description: balancePaymentError,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [balancePaymentError, isPayingBalance])

    const showBalancePaymentModal = (bulkSelectedIds) => {
        setSelectedIds(bulkSelectedIds)
        balancePaymentModal?.show()
    }

    const showValidationBenefitPaymentModal = (bulkSelectedIds) => {
        setSelectedIds(bulkSelectedIds)
        validationBenefitModal?.show()
    }

    function handleBalancePaymentSubmission() {
        executeBalancePaymentAction(
            `${BASE_API_URI}/payments/pay-users-balance/`,
            { ids: selectedIds }
        )
    }

    function handleValidationPaymentSubmission() {
        executeValidationBenefitAction(
            `${BASE_API_URI}/payments/pay-users-validation-benefit/`,
            { ids: selectedIds }
        )
    }

    return (
        <Fragment>
            <PageMeta title="User Payment | UG Speech Data" />

            <div ref={creditModalRef} className="modal fade" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-mg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Update Wallet
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <span className="badge bg-primary">{selectedIds.length} selected</span>
                            <div className="form-group my-3">
                                <label htmlFor="amount">Amount</label>
                                {/* <p className="m-0 p-0"><span className="badge bg-primary"><i className="bi bi-info-circle me-2"></i> Enter negative amount to debit.</span></p> */}
                                <div className="d-flex align-items-center">
                                    <input type="number" className="form-control" name='amount' value={creditAmount} step={0.01} onChange={(e) => setCreditAmount(e.target.value)} />
                                    <button
                                        type="submit"
                                        className='btn btn-primary mx-2 d-flex'
                                        disabled={isCrediting || creditAmount == 0}
                                        onClick={handleCreditSubmission}>
                                        {isCrediting && <span className="mx-2"><Spinner /></span>}
                                        Submit
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

            <div ref={paymentModalRef} className="modal fade" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-mg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Pay Selected Users
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <span className="badge bg-primary">{selectedIds.length} selected</span>
                            <div className="form-group my-3">
                                <label htmlFor="amount">Amount</label>
                                <div className="d-flex align-items-center">
                                    <input type="number" className="form-control" value={paymentAmount} min={0} step={0.01} onChange={(e) => setPaymentAmount(e.target.value)} />
                                    <button
                                        type="submit"
                                        className='btn btn-primary mx-2 d-flex'
                                        disabled={isPaying || paymentAmount == 0}
                                        onClick={handlePaymentSubmission}>
                                        {isPaying && <span className="mx-2"><Spinner /></span>}
                                        Submit
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

            <div ref={paymentBalanceModalRef} className="modal fade" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-mg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Pay the balance of selected users
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <span className="badge bg-primary">{selectedIds.length} selected</span>
                            <div className="form-group my-3">
                                Continue to pay every selected user their outstanding balance?

                                <p className="text text-center">Total Amount: <span className="badge bg-primary">GHC {totalToPay}</span></p>

                                <div className="my-3 d-flex justify-content-center">
                                    <button
                                        type="submit"
                                        className='btn btn-primary mx-2 d-flex'
                                        disabled={isPayingBalance}
                                        onClick={handleBalancePaymentSubmission}>
                                        {isPayingBalance && <span className="mx-2"><Spinner /></span>}
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

            <div ref={paymentValidationModalRef} className="modal fade" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-mg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Pay the validation benefit of selected users
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <span className="badge bg-primary">{selectedIds.length} selected</span>
                            <div className="form-group my-3">
                                Continue to pay every selected user their validation benefit?

                                <p className="text text-center">Total Amount: <span className="badge bg-primary">GHC {totalToPay}</span></p>
                                <div className="my-3 d-flex justify-content-center">
                                    <button
                                        type="submit"
                                        className='btn btn-primary mx-2 d-flex'
                                        disabled={isPayingValidation}
                                        onClick={handleValidationPaymentSubmission}>
                                        {isPayingValidation && <span className="mx-2"><Spinner /></span>}
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

            {/* End of modals */}
            <div className="mb-5 overflow-scroll">
                <TableView
                    responseDataAttribute="users"
                    reloadTrigger={triggerReload}
                    dataSourceUrl={`${BASE_API_URI}/payments/users`}
                    filters={
                        [
                            { key: `wallet__balance__gt:0`, value: `Has balance`, defaultValue: true },
                            ...(groups?.map(group => { return { key: `groups__name__icontains:${group.name}`, value: `User's in group: '${group.name}'` } }) || []),
                        ]
                    }
                    bulkActions={[
                        {
                            name: "Pay outstanding balance", action: (bulkSelectedIds, selectedItems) => {
                                let total = 0
                                selectedItems.forEach(user => {
                                    total += Number.parseFloat(user.balance)
                                });
                                setTotalToPay(total.toFixed(2))
                                showBalancePaymentModal(bulkSelectedIds)
                            }
                        },
                        {
                            name: "Pay accrued validation benefit", action: (bulkSelectedIds, selectedItems) => {
                                let total = 0
                                selectedItems.forEach(user => {
                                    total += Number.parseFloat(user.validation_benefit)
                                });
                                setTotalToPay(total.toFixed(2))
                                showValidationBenefitPaymentModal(bulkSelectedIds)
                            }
                        },
                        { name: "Pay selected an amount", action: (bulkSelectedIds) => showPaymentModal(bulkSelectedIds) },
                        { name: "Credit selected an amount", action: (bulkSelectedIds) => { setSign(1); showCreditModal(bulkSelectedIds) } },
                    ]}
                    headers={[
                        {
                            key: "fullname",
                            value: "Bio", render: (item) => {
                                return (
                                    <Fragment>
                                        <span>{item.fullname}</span><br />
                                        <span className={'badge bg-primary'}>{item.email_address}</span> <br />
                                        <span className={'badge bg-primary'}>{item.phone}</span>
                                    </Fragment>
                                )
                            }
                        },
                        {
                            key: "recording_benefit",
                            value: "Rec. by oneself", render: (item) => {
                                return <span className='d-flex'>{item.recording_benefit} ({item.audios_accepted})</span>
                            }
                        },
                        {
                            key: "audios_by_recruits_benefit",
                            value: "Rec. by recruits", render: (item) => {
                                return <span className='d-flex'>{item.audios_by_recruits_benefit} ({item.accepted_audios_from_recruits})</span>
                            }
                        },
                        {
                            key: "validation_benefit",
                            value: "Val. Amount", render: (item) => {
                                return <span className='d-flex'>{item.validation_benefit} ({item.audios_validated})</span>
                            }
                        },
                        {
                            key: "transcription_benefit",
                            value: "Trans. Amount", render: (item) => {
                                return <span className='d-flex'>{item.transcription_benefit} ({item.audios_transcribed})</span>
                            }
                        },
                        {
                            key: "accrued_amount", value: "Accrued Amount"
                        },
                        {
                            key: "total_payout",
                            value: "Total Payout", render: (item) => {
                                return <div className='d-flex'>
                                    <span className='col-md-3'>{item.total_payout}</span>
                                    <button className='col-md-7 mx-3 btn btn-sm btn-outline-primary' onClick={() => { setSign(-1); showCreditModal([item.id]) }}>Paid</button>
                                </div>
                            }
                        },
                        {
                            value: "Balance", render: (item) => {
                                return (
                                    <span className="badge bg-primary">{item.balance}</span>
                                )
                            }
                        }
                    ]}
                >
                </TableView>
            </div>
        </Fragment>
    );
}

export default UserPayment;
