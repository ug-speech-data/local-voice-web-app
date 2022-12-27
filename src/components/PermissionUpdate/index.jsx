import './style.scss';
import { useDispatch } from 'react-redux';
import { useLazyGetUserPermissionsQuery } from '../../features/resources/resources-api-slice';
import { setUserPermissions } from '../../features/authentication/authentication-api-slice';
import { useToast, Spinner } from '@chakra-ui/react'

function PermissionUpdate() {
    const [trigger, { data: response = [], isFetching, error }] = useLazyGetUserPermissionsQuery()
    const dispatch = useDispatch()
    const toast = useToast()

    if (error) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${error.originalStatus}`,
            description: error.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    } else if (response['user_permissions'] !== undefined){
        localStorage.setItem('user_permissions', JSON.stringify(response['user_permissions']))
        dispatch(setUserPermissions(response['user_permissions']))
        window.location.reload()
    }

    return (
        <button className='' onClick={() => trigger()}>
            {isFetching ? <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='purple.500'
                size='sm'
            /> :
                <i className="bi bi-arrow-clockwise mx-2"></i>}
            Reload
        </button>
    );
}

export default PermissionUpdate;
