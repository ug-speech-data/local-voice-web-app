import React, { useEffect } from 'react'
import TableView from '../../components/Table';
import { Fragment } from "react";
import PageMeta from '../../components/PageMeta';
import { useToast } from '@chakra-ui/react';
import useAxios from '../../app/hooks/useAxios';
import { BASE_API_URI } from '../../utils/constants';


function TransactionHistory() {
    const { trigger: checkTransactionsStatus, data: statusCheckResponse, error: statusCheckError, isLoading: isSubmittingStatusCheck } = useAxios({ method: "POST" })
    const toast = useToast()

    useEffect(() => {
        if (isSubmittingStatusCheck) {
            toast({
                id: "submitting",
                position: 'top-center',
                title: "Submitting status check request.",
                status: 'info',
                duration: null,
                isClosable: true,
            })
        }
    }, [isSubmittingStatusCheck])

    useEffect(() => {
        if (statusCheckError && !isSubmittingStatusCheck) {
            toast.close("submitting")
            toast({
                position: 'top-center',
                title: statusCheckError,
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
        }
    }, [statusCheckError, isSubmittingStatusCheck])

    useEffect(() => {
        if (statusCheckResponse?.message && !isSubmittingStatusCheck) {
            toast.close("submitting")

            toast({
                position: 'top-center',
                title: statusCheckResponse.message,
                status: 'info',
                duration: 1000,
                isClosable: true,
            })
        }
    }, [statusCheckResponse, isSubmittingStatusCheck])

    function handleStatusCheck(selectedIds) {
        checkTransactionsStatus(
            `${BASE_API_URI}/payments/transactions-status-check`,
            { ids: selectedIds }
        )
    }

    return (
        <Fragment>
            <PageMeta title="Transaction History | Local Voice" />

            <div className="mb-5 overflow-scroll">
                <TableView
                    responseDataAttribute="transactions"
                    dataSourceUrl={`${BASE_API_URI}/payments/transactions-history`}
                    filterByDate={true}
                    exportFileName="transaction-history"
                    filters={[
                        { key: `status:new`, value: `New` },
                        { key: `status:pending`, value: `Pending` },
                        { key: `status:success`, value: `Success` },
                        { key: `status:failed`, value: `Failed` }
                    ]}
                    filters2={[
                        { key: `direction:OUT`, value: `Momo sent` },
                        { key: `direction:IN`, value: `Account deposit` },
                    ]}
                    bulkActions={[
                        { name: "Check status of selected", action: (bulkSelectedIds) => handleStatusCheck(bulkSelectedIds) },
                    ]}
                    headers={[
                        {
                            key: "transaction_id", value: "Transaction ID",
                        },
                        {
                            key: "amount", value: "Amount",
                        },
                        {
                            key: "phone_number", value: "Phone"
                        }, {
                            key: "network", value: "Network"
                        }, {
                            key: "fullname", value: "User"
                        },
                        {
                            key: "created_at", value: "Date"
                        },
                        {
                            key: "note", value: "Note"
                        }, {
                            value: "Status", render: (item) => {
                                switch (item.status) {
                                    case "pending":
                                        return <span className="badge bg-warning">{item.status}</span>
                                    case "failed":
                                        return <span className="badge bg-danger">{item.status}</span>
                                    case "success":
                                        return <span className="badge bg-success">{item.status}</span>
                                    default:
                                        return <span className="badge bg-primary">{item.status}</span>
                                }
                            }
                        }
                    ]}
                >
                </TableView>
            </div>
        </Fragment>
    );
}

export default TransactionHistory;
