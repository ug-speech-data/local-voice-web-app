import {
    useLazyGetGroupPermissionsQuery,
    usePutGroupPermissionsMutation,
} from '../../features/resources/resources-api-slice';
import { Fragment, useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useToast, Spinner } from '@chakra-ui/react';

function PermissionsComponent({ group }) {
    const [getGroupPermissions, { data: response = [], isFetching, error }] = useLazyGetGroupPermissionsQuery()
    const toast = useToast()
    const [groupPermissions, setGroupPermissions] = useState([])

    const [putGroupPermissions, { isLoading: isPuttingGroup, isSuccess: successPuttingGroupPermission, error: errorPuttingGroupPermission }] = usePutGroupPermissionsMutation()

    useEffect(() => {
        if (group?.id)
            getGroupPermissions(group?.id)
    }, [group])

    useEffect(() => {
        if (response?.permissions) {
            const permissions = response.permissions
            setGroupPermissions(permissions)
        }
    }, [isFetching])


    useEffect(() => {
        if (errorPuttingGroupPermission) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorPuttingGroupPermission.originalStatus}`,
                description: errorPuttingGroupPermission.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingGroupPermission])

    useEffect(() => {
        if (error) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${error.originalStatus}`,
                description: error.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [error])

    useEffect(() => {
        if (successPuttingGroupPermission) {
            toast({
                position: 'top-center',
                title: `Permissions updated successfully`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [successPuttingGroupPermission])


    return (
        <Fragment>
            <h1>Permissions</h1>
            {isFetching && <Spinner />}
            <table className='table'>
                <thead>
                    <tr>
                        <th>Permission</th>
                        <th>Allow</th>
                    </tr>
                </thead>
                <tbody>
                    {groupPermissions.map((permission, index) => (
                        <tr key={index}>
                            <td>{permission.name}</td>
                            <td>
                                <input
                                    className='form-check-input'
                                    type="checkbox"
                                    name={permission.name}
                                    checked={permission.group_has}
                                    onChange={(e) => {
                                        let newPermissions = JSON.parse(JSON.stringify(groupPermissions))
                                        newPermissions[index].group_has = !permission.group_has
                                        setGroupPermissions(newPermissions)
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />
            <div className="d-flex justify-content-end my-3">
                <button className='btn btn-primary' onClick={async () => {
                    await putGroupPermissions({
                        group_id: group.id,
                        body: { permissions: groupPermissions.filter(perm => perm.group_has).map(permission => permission.id) }
                    }).unwrap()
                }}>
                    {isPuttingGroup ? <Spinner /> : 'Save'}
                </button></div>

        </Fragment >
    );
}

export default PermissionsComponent;
