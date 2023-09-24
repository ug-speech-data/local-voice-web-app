import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { Fragment } from "react";
import PageMeta from "../../components/PageMeta";
import React, { useEffect, useState } from 'react'
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';
import TableView from '../../components/Table';
import useAxios from '../../app/hooks/useAxios';
import { useToast } from '@chakra-ui/react';


function UserStatsScreen() {
    const [triggerReload, setTriggerReload] = useState(0);
    const { trigger: updateUserStat, data: response, error: errorUpdating, isLoading } = useAxios({ method: "POST" });
    const toast = useToast()

    const handleSendRequest = async (user_id) => {
        const body = {
            user_id
        }
        updateUserStat(
            `${BASE_API_URI}/user-statistics/`,
            body
        )
    }

    // Update error
    useEffect(() => {
        if (Boolean(errorUpdating) && !isLoading) {
            toast.close("send")
            toast({
                id: "send",
                position: 'top-center',
                title: `An error occurred`,
                description: errorUpdating,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorUpdating, isLoading])

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
            setTriggerReload((triggerReload) => triggerReload + 1);
        }
    }, [response, isLoading])


    return (
        <Fragment>
            <PageMeta title="User Statistics | Speech Data UG" />
            <TopNav />
            <div className="my-3 mx-auto col-md-11 col-11">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4><b>User Statistics Overview</b></h4>
                        <p className="text-muted mb-4">Explore comprehensive statistics encompassing user recording, validation, and transcription activities.</p>
                    </div>
                </div>

                <div className="mb-5 overflow-scroll">
                    <TableView
                        reloadTrigger={triggerReload}
                        responseDataAttribute="users"
                        dataSourceUrl={`${BASE_API_URI}/user-statistics/`}
                        filters={[
                            { key: "locale:ak_gh", value: "Akan" },
                            { key: "locale:dga_gh", value: "Dagbani" },
                            { key: "locale:dag_gh", value: "Dagaare" },
                            { key: "locale:ee_gh", value: "Ewe" },
                            { key: "locale:kpo_gh", value: "Ikposo" },
                        ]}
                        headers={[
                            {
                                key: "fullname",
                                value: "Full Name",
                                render: (item) => {
                                    return (
                                        <Link to={`/collected-data?query=${item.email_address}&tab=4`}>
                                            <span className={'badge bg-primary'}>{item.fullname}</span>
                                            <br /><span>{item.email_address}</span>
                                        </Link>
                                    )
                                },
                            },
                            {
                                key: "locale", value: "Locale", textAlign: "center",
                            },
                            { key: "audios_submitted", value: "Audios Submitted", textAlign: "center", },
                            { key: "audios_rejected", value: "Rejected Audios", textAlign: "center", },
                            { key: "audios_pending", value: "Pending audios", textAlign: "center", },
                            { key: "audios_accepted", value: "Accepted Audios", textAlign: "center", },
                            { key: "audios_validated", value: "Aud. Validated", textAlign: "center", },
                            { key: "transcriptions_resolved", value: "Trans Resolved", textAlign: "center", },
                            { key: "audios_transcribed", value: "Transcription", textAlign: "center", },

                            {
                                value: "Actions", textAlign: "right", render: (item) => {
                                    return (
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-sm btn-outline-primary me-1 d-flex" disabled={isLoading} onClick={() => handleSendRequest(item.id)}>
                                                <i className="bi bi-list me-1"></i>
                                                Update
                                            </button>
                                        </div>
                                    )
                                }
                            }]}
                    >
                    </TableView>
                </div>
            </div>
            <Footer />
        </Fragment >
    );
}

export default UserStatsScreen;
