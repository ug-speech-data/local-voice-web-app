import './style.scss';
import React, { useState, useEffect } from 'react'
import useAxios from '../../app/hooks/useAxios';
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';
import { Spinner, useToast } from "@chakra-ui/react";
import PageMeta from '../../components/PageMeta';


function FindUsers() {
    const { trigger: getUsers, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/search-users`, useAuthorisation: false });
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [newQuery, setNewQuery] = useState(true);
    const toast = useToast();

    function searchUsers(query) {
        getUsers(`${BASE_API_URI}/search-users?query=${query}`);
    }

    useEffect(() => {
        if (responseData?.users) {
            setUsers(responseData.users);
            setNewQuery(false)
        }
    }, [responseData]);

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                position: "top-center",
                description: error,
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }, [error]);

    return (
        <div className="home-page">
            <PageMeta title="Search Users | Speech Data UG" />

            <div className="content col-11 col-md-8 mx-auto">
                <h1 className='text-center h1'>UG SPEECH DATA</h1>
                <div className='col-md-8 mx-auto'>
                    <h3 className="h3 text-center my-3">Search User Details</h3>
                </div>
                <div className='text-center my-3 row mx-auto justify-content-center align-items-center col-12'>
                    <div className="col-md-8 form-group my-1">
                        <input type="search" placeholder='Search with phone number or name' value={query} className="form-control" onChange={e => { setNewQuery(true); setQuery(e.target.value) }} />
                    </div>
                    <div className="col-md-4 form-group">
                        <button className="btn btn-outline-primary text-white d-flex mx-2 justify-content-center align-items-center" onClick={() => searchUsers(query)} disabled={isLoading || query === ""}>
                            {isLoading ? <Spinner /> : <i className="bi bi-search mx-2"></i>}
                            Search User
                        </button>
                    </div>
                </div>
                {newQuery ? "" :
                    < div style={{ backgroundColor: "gray", overflow: "auto" }}>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Surname</th>
                                    <th>Other Names</th>
                                    <th>Phone</th>
                                    <th>Email Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Boolean(users?.length) ?
                                    users?.map(user => {
                                        return <tr>
                                            <td>{user.surname}</td>
                                            <td>{user.other_names}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.email_address}</td>
                                        </tr>
                                    })
                                    :
                                    <tr>
                                        <td colSpan={4}>
                                            <p className="text-warning text-center">No user found for query: {query}</p>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div >
    );
}

export default FindUsers;
