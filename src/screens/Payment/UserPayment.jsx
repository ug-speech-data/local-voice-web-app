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
    const [getGroups, { data: response = [], isFetching, error }] = useLazyGetGroupsQuery()
    const { trigger: executeCreditAction, data: creditResponseData, error: creditError, isLoading: isCrediting } = useAxios({ method: "POST" })
    const { trigger: executePaymentAction, data: paymentResponseData, error: paymentError, isLoading: isPaying } = useAxios({ method: "POST" })
    const { trigger: executeBalancePaymentAction, data: balancePaymentResponseData, error: balancePaymentError, isLoading: isPayingBalance } = useAxios({ method: "POST" })

    const [groups, setGroups] = useState([])
    const [selectedIds, setSelectedIds] = useState([])

    const creditModalRef = useRef(null);
    const paymentModalRef = useRef(null);
    const paymentBalanceModalRef = useRef(null);

    const [creditModal, setCreditModal] = useState(null)
    const [paymentModal, setPaymentModal] = useState(null)
    const [balancePaymentModal, setBalancePaymentModal] = useState(null)

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

    const showCreditModal = (bulkSelectedIds) => {
        setSelectedIds(bulkSelectedIds)
        creditModal?.show()
    }
    function handleCreditSubmission() {
        executeCreditAction(
            `${BASE_API_URI}/payments/credit-users/`,
            { ids: selectedIds, amount: creditAmount }
        )
    }

    // Paying users
    const [paymentAmount, setPaymentAmount] = useState(0)
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
    function handleBalancePaymentSubmission() {
        executeBalancePaymentAction(
            `${BASE_API_URI}/payments/pay-users-balance/`,
            { ids: selectedIds }
        )
    }

    return (
        <Fragment>
            <PageMeta title="User Payment | Local Voice" />

            {/* Modals */}

            <div ref={creditModalRef} className="modal fade" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-mg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Credit Selected Users
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <span className="badge bg-primary">{selectedIds.length} selected</span>
                            <div className="form-group my-3">
                                <label htmlFor="amount">Amount</label>
                                <p className="m-0 p-0"><span className="badge bg-primary"><i className="bi bi-info-circle me-2"></i> Enter negative amount to debit.</span></p>
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

            {/* End of modals */}

            <div className="mb-5 overflow-scroll">
                <TableView
                    responseDataAttribute="users"
                    dataSourceUrl={`${BASE_API_URI}/payments/users`}
                    filters={
                        groups?.map(group => { return { key: `groups__name__icontains:${group.name}`, value: `User's in group: '${group.name}'` } })
                    }
                    bulkActions={[
                        { name: "Credit selected", action: (bulkSelectedIds) => showCreditModal(bulkSelectedIds) },
                        { name: "Pay selected", action: (bulkSelectedIds) => showPaymentModal(bulkSelectedIds) },
                        { name: "Pay outstanding balance", action: (bulkSelectedIds) => showBalancePaymentModal(bulkSelectedIds) },
                    ]}
                    headers={[
                        {
                            key: "fullname", value: "Full Name",
                        },
                        {
                            key: "email_address", value: "Email Address",
                        }, {
                            key: "phone", value: "Momo Number"
                        }, {
                            key: "accrued_amount", value: "Accrued Amount"
                        }, {
                            key: "total_payout", value: "Total Payout"
                        }, {
                            value: "Balance", render: (item) => {
                                return (
                                    <span className="badge bg-primary">{item.balance}</span>
                                )
                            }
                        },
                        {
                            key: "wallet_last_updated_at", value: "Wallet Updated"
                        },
                    ]}
                >
                </TableView>
            </div>
        </Fragment>
    );
}

export default UserPayment;
