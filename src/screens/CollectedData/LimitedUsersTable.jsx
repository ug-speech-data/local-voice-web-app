import { Fragment, useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useToast, Spinner } from '@chakra-ui/react';
import TableView from '../../components/Table';
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';
import useAxios from '../../app/hooks/useAxios';
import { useSelector } from 'react-redux';

function LimitedUsersTable() {
    const [triggerReload, setTriggerReload] = useState(0);
    const modalRef = useRef(null);
    const [modal, setModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const toast = useToast()
    const loggedInUser = useSelector((state) => state.authentication.user);

    const { trigger: updateUser, data: updateUserResponse, error: errorUpdatingUser, isLoading: isUpdatingUser } = useAxios({ method: "POST" })

    useEffect(() => {
        if (modalRef.current !== null && modal === null) {
            const modal = new Modal(modalRef.current, { keyboard: false })
            setModal(modal)
        }
    }, [modal])

    const showEditUserModal = (user) => {
        setSelectedUser(user)
        modal?.show()
    }

    const handleFormSubmit = async (e) => {
        updateUser(
            `${BASE_API_URI}/limited-users/`,
            { user_id: selectedUser.id }
        )
    }
    useEffect(() => {
        if (Boolean(updateUserResponse)) {
            toast.close("update-toast")
            toast({
                id: "update-toast",
                position: 'top-center',
                title: `Attention`,
                description: updateUserResponse.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
        }
        modal?.hide()
        setTriggerReload((triggerReload) => triggerReload + 1);
    }, [updateUserResponse])


    useEffect(() => {
        if (errorUpdatingUser) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorUpdatingUser.originalStatus}`,
                description: errorUpdatingUser.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorUpdatingUser, toast])

    return (
        <Fragment>
            <div ref={modalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Remove Restriction</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <p className="">Allow this user to download all assigned images and record?</p>
                            <div className="d-flex justify-content-center my-3">
                                <button
                                    className='btn btn-sm btn-primary d-flex align-items-center'
                                    onClick={handleFormSubmit}
                                    disabled={isUpdatingUser}>
                                    {isUpdatingUser && <Spinner />}
                                    Yes
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-5 overflow-scroll">
                <TableView
                    reloadTrigger={triggerReload}
                    responseDataAttribute="users"
                    dataSourceUrl={`${BASE_API_URI}/limited-users/`}
                    filters={[
                        { key: "locale:ak_gh", value: "Akan", defaultValue: loggedInUser?.locale === "ak_gh" },
                        { key: "locale:dga_gh", value: "Dagbani", defaultValue: loggedInUser?.locale === "dga_gh" },
                        { key: "locale:dag_gh", value: "Dagaare", defaultValue: loggedInUser?.locale === "dag_gh" },
                        { key: "locale:ee_gh", value: "Ewe", defaultValue: loggedInUser?.locale === "ee_gh" },
                        { key: "locale:kpo_gh", value: "Ikposo", defaultValue: loggedInUser?.locale === "kpo_gh" },
                    ]}
                    headers={[{
                        key: "photo", value: "Photo"
                    }, {
                        key: "surname", value: "Surname"
                    }, {
                        key: "other_names", value: "Other Names"
                    }, {
                        key: "email_address", value: "Email Address", render: (item) => {
                            return (
                                <Link to={`/collected-data?query=${item.email_address}&tab=0`}
                                    className="text-primary">{item.email_address}</Link>
                            )
                        }
                    }, {
                        key: "phone", value: "Phone", render: (item) => {
                            return (
                                <Link to={`/collected-data?query=${item.phone}&tab=0`}
                                    className="text-primary">{item.phone}</Link>
                            )
                        }
                    }, {
                        key: "locale", value: "Locale"
                    }, {
                        key: "audios_submitted", value: "Audios Submitted"
                    }, {
                        key: "audios_accepted", value: "Audios Accepted"
                    }, {
                        value: "Actions", render: (item) => {
                            return (
                                <div className="d-flex">
                                    <div className='mx-2'>
                                        <span className="badge bg-danger"><small>Restricted</small></span>
                                        {/* <span className="badge bg-success">Unrestricted</span> */}
                                    </div>
                                    <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showEditUserModal(item)}>
                                        <i className="bi bi-check me-1"></i>
                                        Remove Restriction
                                    </button>
                                </div>
                            )
                        }
                    }]}
                />
            </div>
        </Fragment >
    );
}

export default LimitedUsersTable;
