import {
    useLazyGetUsersQuery,
    usePutUsersMutation,
    useDeleteUsersMutation,
} from '../../features/resources/resources-api-slice';
import { Fragment, useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useToast, Spinner } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import TagInput from '../../components/TagInput';
import PasswordInput from '../../components/PasswordInput';

function UsersCard() {
    const [getUsers, { data: response = [], isFetching, error }] = useLazyGetUsersQuery()
    const modalRef = useRef(null);
    const deletionModalRef = useRef(null);
    const [modal, setModal] = useState(null);
    const [deleteAlertModal, setDeletionAlertModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const toast = useToast()
    const [users, setUsers] = useState([])

    const [putUser, { isLoading: isPuttingUser, error: errorPuttingUser }] = usePutUsersMutation()
    const [deleteUser, { isLoading: isDeletingUser, error: errorDeletingUser }] = useDeleteUsersMutation()
    const groups = useSelector((state) => state.global.groups);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [allUsers, setAllUsers] = useState([])

    // Form input
    const [surname, setSurname] = useState('');
    const [otherNames, setOtherNames] = useState('');
    const [phone, setPhone] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    // Filter inputs
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('surname');

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    useEffect(() => {
        const groups = selectedUser?.groups || []
        setSelectedGroups(groups)
    }, [selectedUser])

    useEffect(() => {
        setUsers(response["users"])
        setAllUsers(response["users"])
        setTotalPages(response["total_pages"])
        setNextPage(response["next_page"])
        setPreviousPage(response["previous_page"])
    }, [isFetching])


    useEffect(() => {
        getUsers(1)
    }, [])

    useEffect(() => {
        getUsers(page)
    }, [page])

    useEffect(() => {
        if (modalRef.current !== null && modal === null) {
            const modal = new Modal(modalRef.current, { keyboard: false })
            setModal(modal)
        }

        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current, { keyboard: false })
            setDeletionAlertModal(modal)
        }
    }, [])

    const showEditUserModal = (user) => {
        setSelectedUser(user)
        setSurname(user.surname || "")
        setOtherNames(user.other_names || "")
        setPhone(user.phone || "")
        setEmailAddress(user.email_address || "")
        setPassword("")
        modal?.show()
    }

    const showNewFormUserModal = () => {
        setSelectedUser(null)
        setSurname("")
        setOtherNames("")
        setPhone("")
        setEmailAddress("")
        setPassword("")
        modal?.show()
    }

    const handleDeleteUser = async () => {
        const response = await deleteUser({ id: selectedUser.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            setUsers(users.filter(c => c.id !== selectedUser.id))
            toast({
                position: 'top-center',
                title: `Success`,
                description: "User deleted successfully",
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

    const showDeleteUserAlert = (user) => {
        setSelectedUser(user)
        deleteAlertModal?.show()
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const body = { surname, other_names: otherNames, phone, email_address: emailAddress, groups: selectedGroups, password: password }
        if (selectedUser) {
            body['id'] = selectedUser.id
        }
        const response = await putUser(body).unwrap()
        const user = response["user"]
        if (user !== undefined) {
            setUsers([user, ...users.filter(c => c.id !== user.id)])
            modal?.hide()
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
    }, [errorPuttingUser])


    useEffect(() => {
        if (errorDeletingUser) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorDeletingUser.status}`,
                description: errorDeletingUser.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorDeletingUser])

    useEffect(() => {
        const users = allUsers.filter(c => {
            return c.surname.toLowerCase().includes(search.toLowerCase())
                || c.other_names.toLowerCase().includes(search.toLowerCase())
                || c.phone.toLowerCase().includes(search.toLowerCase())
                || c.email_address.toLowerCase().includes(search.toLowerCase())
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
            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete User - '{selectedUser?.other_names} {selectedUser?.surname}'
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                <div className="d-flex flex-column">
                                    <h5>Are you sure you want to delete this user?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingUser && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteUser(selectedUser)} >Yes, continue</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

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

                                <h1><b>BIO</b></h1>
                                <div className="mb-3">
                                    <label htmlFor="surname" className="form-label">Surname</label>
                                    <input type="text" className="form-control" id="surname" aria-describedby="surname"
                                        onChange={(e) => setSurname(e.target.value)}
                                        placeholder="Enter surname"
                                        value={surname} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="other-names" className="form-label">Other Names</label>
                                    <input type="text" className="form-control" id="other-names" aria-describedby="other-names"
                                        onChange={(e) => setOtherNames(e.target.value)}
                                        placeholder="Enter other names"
                                        value={otherNames} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Momo Number</label>
                                    <input type="text" className="form-control" id="phone" aria-describedby="phone"
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter momo number"
                                        value={phone} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email_address" className="form-label">Email Address</label>
                                    <input type="email" className="form-control" id="email_address" aria-describedby="email_address"
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        placeholder="Enter email address"
                                        value={emailAddress} />
                                </div>

                                <div className="mt-5">
                                    <h1><b>GROUPS</b></h1>
                                    <TagInput tags={groups?.map((group) => group.name)} selectedTags={selectedGroups} setSelectedTags={setSelectedGroups} maxSelection={groups?.length} />
                                </div>

                                <div className="my-5">
                                    <h1><b>PASSWORD</b></h1>
                                    {selectedUser && <p className="text-muted">Leave blank to keep current password</p>}
                                    <PasswordInput value={password} setValue={setPassword} required={selectedUser == null} />
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

            <div className="card">
                <div className="card-header d-flex justify-content-between" style={{ "position": "sticky", "top": "-1em", "zIndex": "1", "background": "white" }}>
                    <h1>USERS</h1>
                    <div className="d-flex card-options justify-content-end">
                        <button className="btn btn-primary btn-sm" onClick={showNewFormUserModal} >Add</button>
                    </div>
                </div>
                <div className="card-body overflow-scroll">
                    <div className="d-flex justify-content-between mb-3">
                        <div className="d-flex">
                            <div className="d-flex align-items-center">
                                <label htmlFor="search" className="form-label me-2">Search</label>
                                <input type="text" className="form-control" id="search" aria-describedby="search"
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search"
                                    value={search} />
                            </div>
                            <div className="d-flex align-items-center mx-3">
                                <button className="btn btn-sm btn-primary"
                                    disabled={previousPage == null || isFetching}
                                    onClick={() => setPage(page - 1)}
                                >Previous</button>
                                <span className="mx-2 badge bg-primary">page {page} of {totalPages}</span>
                                <button className="btn btn-sm btn-primary"
                                    disabled={nextPage == null || isFetching}
                                    onClick={() => setPage(page + 1)}
                                >Next</button>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="d-flex align-items-center">
                                <label htmlFor="search" className="form-label me-2">Sort</label>
                                <select className="form-select" aria-label="Default select example"
                                    onChange={(e) => setSort(e.target.value)}
                                    value={sort}>
                                    <option value="surname">Surname</option>
                                    <option value="other_names">Other Names</option>
                                    <option value="phone">Phone</option>
                                    <option value="email_address">Email Address</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Other Names</th>
                                <th>Surname</th>
                                <th>Number</th>
                                <th>Email Address</th>
                                <th>Groups</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetching && <tr><td colSpan="7">
                                <p className="text-center d-flex justify-content-center">
                                    <Spinner />
                                    Loading...
                                </p>
                            </td></tr>}
                            {(!isFetching && users?.length == 0) && <tr><td colSpan="7">No users</td></tr>}
                            {error && <tr><td colSpan="2">Error: {error.status}</td></tr>}
                            {users && users?.map((user, index) => (
                                <tr key={index}>
                                    <td><img src={user.photo_url} alt="" className="profile-image" /></td>
                                    <td>{user.other_names}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.email_address}</td>
                                    <td>{user.groups?.map((group, index) => {
                                        return <span key={index} className="badge bg-primary">{group}</span>
                                    })}
                                    </td>
                                    <td className='d-flex'>
                                        <button className="mx-1 btn btn-outline-primary btn-sm d-flex"
                                            onClick={() => showEditUserModal(user)}>
                                            <i className="bi bi-pen me-1"></i> Edit
                                        </button>
                                        <button className="mx-1 btn btn-outline-primary btn-sm d-flex"
                                            onClick={() => showDeleteUserAlert(user)}
                                        ><i className="bi bi-trash me-1"></i> Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment >
    );
}

export default UsersCard;
