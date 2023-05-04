import {
    usePutUsersMutation,
} from '../../features/resources/resources-api-slice';
import { Fragment, useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useToast, Spinner } from '@chakra-ui/react';
import TagInput from '../../components/TagInput';
import PasswordInput from '../../components/PasswordInput';
import SelectInput from '../../components/SelectInput';
import TableView from '../../components/Table';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';
import { Link } from 'react-router-dom';


function UsersTable() {
    const [triggerReload, setTriggerReload] = useState(0);
    const modalRef = useRef(null);
    const [modal, setModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const toast = useToast()
    const [users, setUsers] = useState([])
    const [hidePassowordUpdate, setHidePassowordUpdate] = useState(true);
    const [urlParams, setUrlParams] = useState("");

    const [putUser, { isLoading: isPuttingUser, error: errorPuttingUser }] = usePutUsersMutation()
    const { trigger: getGroups, data: response, error, isLoading } = useAxios()


    const [selectedGroups, setSelectedGroups] = useState([]);
    const [allUsers] = useState([])
    const [groups, setGroups] = useState([])

    // Form input
    const [surname, setSurname] = useState('');
    const [otherNames, setOtherNames] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneNetwork, setPhoneNetwork] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [locale, setLocale] = useState('');
    const [assignedImageBatch, setAssignedImageBatch] = useState('');
    const [assignedAudioBatch, setAssignedAudioBatch] = useState('');
    const [leadEmailAddress, setLeadEmailAddress] = useState('');

    // Filter inputs
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('surname');

    useEffect(() => {
        const groups = selectedUser?.groups || []
        setSelectedGroups(groups)
    }, [selectedUser])

    useEffect(() => {
        if (Boolean(response?.groups)) { setGroups(response["groups"]) }
    }, [response, isLoading])

    useEffect(() => {
        getGroups(`${BASE_API_URI}/groups?limited=true`)
    }, [])

    useEffect(() => {
        if (modalRef.current !== null && modal === null) {
            const modal = new Modal(modalRef.current, { keyboard: false })
            setModal(modal)
        }
    }, [modal])

    const showEditUserModal = (user) => {
        setSelectedUser(user)
        setSurname(user.surname || "")
        setOtherNames(user.other_names || "")
        setPhone(user.phone || "")
        setPhoneNetwork(user.phone_network || "")
        setEmailAddress(user.email_address || "")
        setLocale(user.locale || "")
        setAssignedImageBatch(user.assigned_image_batch || "")
        setAssignedAudioBatch(user.assigned_audio_batch || "")
        setLeadEmailAddress(user.lead_email_address || "")
        setIsActive(user.is_active)
        setPassword("")
        modal?.show()
    }

    const showNewFormUserModal = () => {
        setSelectedUser(null)
        setSurname("")
        setOtherNames("")
        setPhone("")
        setPhoneNetwork("")
        setEmailAddress("")
        setLocale("")
        setAssignedImageBatch("")
        setAssignedAudioBatch("")
        setPassword("")
        setLeadEmailAddress("")
        modal?.show()
    }

    const handleFormSubmit = async (e) => {
        if (!(surname && otherNames, phone, phoneNetwork, emailAddress, locale)) {
            alert("Choose complete all fields.")
        }

        e.preventDefault()
        const body = {
            surname,
            other_names: otherNames,
            phone,
            phone_network: phoneNetwork,
            email_address: emailAddress,
            groups: selectedGroups,
            locale: locale,
            is_active: isActive,
            assigned_image_batch: assignedImageBatch,
            assigned_audio_batch: assignedAudioBatch,
            lead_email_address: leadEmailAddress,
            password: password,
        }
        if (selectedUser) {
            body['id'] = selectedUser.id
        }
        const response = await putUser(body).unwrap()
        const user = response["user"]
        if (user !== undefined) {
            setUsers([user, ...users.filter(c => c.id !== user.id)])
            modal?.hide()
            setTriggerReload((triggerReload) => triggerReload + 1);
        } else {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: response["error_message"],
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    useEffect(() => {
        if (errorPuttingUser) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorPuttingUser.originalStatus}`,
                description: errorPuttingUser.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingUser, toast])

    useEffect(() => {
        const users = allUsers.filter(c => {
            return c.surname?.toLowerCase()?.includes(search.toLowerCase())
                || c.other_names?.toLowerCase()?.includes(search?.toLowerCase())
                || c.phone?.toLowerCase()?.includes(search?.toLowerCase())
                || c.phone_network?.toLowerCase()?.includes(search?.toLowerCase())
                || c.email_address?.toLowerCase()?.includes(search.toLowerCase())
        })
        setUsers(users)
    }, [search])

    useEffect(() => {
        const toToSorted = [...users]
        toToSorted.sort((a, b) => {
            if (a[sort] < b[sort]) {
                return -1;
            }
            return 1;
        })
        setUsers(toToSorted)
    }, [sort])

    return (
        <Fragment>
            <div ref={modalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedUser ? "Edit User" : "New User"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFormSubmit}>
                                <input type="hidden" name="id"
                                    value={selectedUser ? selectedUser.id : ""} />

                                <p><b>BIO</b></p>
                                <div className="mb-3">
                                    <label htmlFor="surname" className="form-label">Surname</label>
                                    <input type="text" className="form-control" id="surname" aria-describedby="surname"
                                        onChange={(e) => setSurname(e.target.value)}
                                        placeholder="Enter surname"
                                        required
                                        value={surname} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="other-names" className="form-label">Other Names</label>
                                    <input type="text" className="form-control" id="other-names" aria-describedby="other-names"
                                        onChange={(e) => setOtherNames(e.target.value)}
                                        placeholder="Enter other names"
                                        required
                                        value={otherNames} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Momo Number</label>
                                    <input type="text" className="form-control" id="phone" aria-describedby="phone"
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter momo number"
                                        required
                                        value={phone} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone_network" className="form-label">Phone Network</label>
                                    <SelectInput
                                        onChange={(e) => setPhoneNetwork(e.target.value)}
                                        required={true}
                                        value={phoneNetwork}
                                        options={[
                                            { value: "", label: 'Choose network' },
                                            { value: 'MTN', label: 'MTN' },
                                            { value: 'VODAFONE', label: 'VODAFONE' },
                                            { value: 'AIRTELTIGO', label: 'AIRTELTIGO' },
                                        ]}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email_address" className="form-label">Email Address</label>
                                    <input type="email" className="form-control" id="email_address" aria-describedby="email_address"
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        placeholder="Enter email address"
                                        required
                                        value={emailAddress} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="locale" className="form-label">Locale</label>
                                    <SelectInput
                                        onChange={(e) => setLocale(e.target.value)}
                                        value={locale}
                                        required={true}
                                        options={[
                                            { value: '', label: 'Choose locale' },
                                            { value: 'dga_gh', label: 'Dagbani' },
                                            { value: 'dag_gh', label: 'Dagaare' },
                                            { value: 'ee_gh', label: 'Ewe' },
                                            { value: 'kpo_gh', label: 'Ikposo' },
                                            { value: 'ak_gh', label: 'Akan' },
                                        ]}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="lead_email_address" className="form-label">Language Lead's Email</label>
                                    <input type="email" className="form-control" id="lead_email_address" aria-describedby="lead_email_address"
                                        onChange={(e) => setLeadEmailAddress(e.target.value)}
                                        placeholder="Email Language Lead"
                                        value={leadEmailAddress} />
                                </div>

                                <div className="mt-5">
                                    <p><b>GROUPS</b></p>
                                    <TagInput tags={groups?.map((group) => group.name)} selectedTags={selectedGroups} setSelectedTags={setSelectedGroups} maxSelection={groups?.length} searchable={true} />
                                </div>

                                <div className="my-3">
                                    <p className="p-0 m-0">
                                        <small className="text-muted">Uncheck to block this user.</small>
                                    </p>
                                    <label htmlFor="is_active" className="form-label">Is Active</label>
                                    <input type="checkbox" className="ms-2 form-check-input" id="is_active" aria-describedby="is_active"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)} />
                                </div>

                                <div className="my-5">
                                    <div className="d-flex justify-content-between">
                                        <p><b>PASSWORD</b></p>
                                        <button className="btn btn-light"
                                            type='button'
                                            onClick={() => {
                                                setPassword("")
                                                setHidePassowordUpdate(!hidePassowordUpdate)
                                            }}>
                                            {hidePassowordUpdate && "show"}
                                            {!hidePassowordUpdate && "hide"}
                                        </button>
                                    </div>
                                    {!hidePassowordUpdate &&
                                        <div>
                                            {selectedUser && <p className="text-muted">Leave blank to keep current password</p>}
                                            <PasswordInput value={password} setValue={setPassword} required={selectedUser === null} />
                                        </div>
                                    }
                                </div>

                                <div className="mb-5">
                                    {Boolean(selectedUser?.created_by) ? <p className='m-0 p-0'><small className=""><i>Created By: {selectedUser?.created_by}</i></small></p> : ""}
                                    {Boolean(selectedUser?.updated_by) ? <p className='m-0 p-0'><small className=""><i>Updated By: {selectedUser?.updated_by}</i></small></p> : ""}
                                </div>

                                <div className="mb-3">
                                    <p className="text-end">
                                        <button
                                            className='btn btn-sm btn-primary d-flex align-items-center'
                                            disabled={isPuttingUser}>
                                            {isPuttingUser && <Spinner />}
                                            Submit
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="card-header d-flex justify-content-between">
                    <p></p>
                    <div className="m-3 d-flex card-options justify-content-end">
                        <button className="btn btn-primary btn-sm" onClick={showNewFormUserModal}>New User</button>
                    </div>
                </div>
                <div className="card-body overflow-scroll">
                    <TableView
                        reloadTrigger={triggerReload}
                        responseDataAttribute="users"
                        dataSourceUrl={`${BASE_API_URI}/users/`}
                        urlParams={urlParams}
                        setUrlParams={setUrlParams}
                        filters={[
                            ...(groups?.map(group => { return { key: `groups__name:${group.name}`, value: `In ${(group.name || "").toLowerCase()}` } }) || []).sort()
                        ]}
                        bulkActions={[

                        ]}
                        headers={[{
                            key: "photo", value: "Photo"
                        }, {
                            key: "surname", value: "Surname"
                        }, {
                            key: "other_names", value: "Other Names"
                        },
                        {
                            key: "email_address", value: "Email Address", render: (item) => {
                                return (
                                    <Link to={`/collected-data?query=${item.email_address}&tab=0`}
                                        className="text-primary">
                                        <p className={item.is_active ? "" : "text-danger"}>{item.email_address}</p>
                                    </Link>
                                )
                            }
                        },

                        {
                            key: "groups", value: "Group", render: (item) => {
                                return (
                                    <div>
                                        {item.groups?.map((group, index) => (
                                            <span key={index} className="badge bg-primary">{group}</span>
                                        ))}
                                    </div>
                                )
                            }
                        }, {
                            value: "Actions", render: (item) => {
                                return (
                                    <div className="d-flex">
                                        <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showEditUserModal(item)}>
                                            <i className="bi bi-list me-1"></i>
                                            More
                                        </button>
                                    </div>
                                )
                            }
                        }]}
                    />
                </div>
            </div>
        </Fragment >
    );
}

export default UsersTable;
