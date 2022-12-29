import './style.scss';
import { Link } from "react-router-dom";
import { useLogOutUserMutation, logOutLocally } from '../../features/authentication/authentication-api-slice';
import { setActiveNavMenu } from '../../features/global/global-slice';
import { useSelector, useDispatch } from 'react-redux';
import { useToast, Spinner } from '@chakra-ui/react'
import PermissionUpdate from '../PermissionUpdate';
import Permissions from "../../utils/permissions";
import { useEffect } from 'react';

function TopNav() {
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const activeMenu = useSelector((state) => state.global.activeTopNavMenu);
    const user = useSelector((state) => state.authentication.user);

    const [logOutUser, { isLoading }] = useLogOutUserMutation()
    const dispatch = useDispatch();
    const toast = useToast()

    const handleLogout = async () => {
        try {
            await logOutUser().unwrap()
            dispatch(logOutLocally());
        } catch (err) {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: err.originalStatus,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    useEffect(() => {
        // Get path from url
        const path = window.location.pathname;
        // Set active menu based on path
        if (path === "/") {
            dispatch(setActiveNavMenu("home"));
        } else if (path === "/tasks") {
            dispatch(setActiveNavMenu("validation"));
        } else if (path === "/collected-data") {
            dispatch(setActiveNavMenu("collected-data"));
        } else if (path === "/setup") {
            dispatch(setActiveNavMenu("setup"));
        }
    }, [dispatch])

    const setActiveMenu = (menu) => {
        dispatch(setActiveNavMenu(menu));
    }

    return (
        <header className="top-nav d-flex justify-content-between align-items-center">
            <div className='nav-left'>
                <Link to="/" className={`nav-menu-item ${activeMenu === 'home' ? 'active' : ''}`} onClick={() => setActiveMenu("home")}>HOME</Link>
                <Link to="/tasks" className={`nav-menu-item ${activeMenu === 'validation' ? 'active' : ''}`} onClick={() => setActiveMenu("validation")}>VALIDATION AND TRANSCRIPTION</Link>
                {userPermissions.has(Permissions.MANAGE_COLLECTED_DATA) &&
                    <Link to="/collected-data" className={`nav-menu-item ${activeMenu === 'collected-data' ? 'active' : ''}`} onClick={() => setActiveMenu("collected-data")}>COLLECTED DATA</Link>
                }
                {userPermissions.has(Permissions.MANAGE_SETUP) &&
                    <Link to="/setup" className={`nav-menu-item ${activeMenu === 'setup' ? 'active' : ''}`} onClick={() => setActiveMenu("setup")}>SETUP</Link>
                }
            </div>
            <div className='nav-right d-flex align-items-center position-relative'>

                <div className="drop-container position-relative">
                    <div className="d-flex align-items-center">
                        <img src={user.avatar
                            ? user.avatar
                            : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} alt="avatar" className='profile-image mx-2' />
                        <span className="ml-2">{user.short_name}</span>
                        <i className="ms-2 bi bi-chevron-down"></i>
                    </div>

                    <div className="drop-down">
                        <p className='drop-down-item'>
                            <Link to=""><i className="bi bi-person mx-2"></i> Profile</Link>
                        </p>
                        <p className='drop-down-item'>
                            <PermissionUpdate />
                        </p>
                        <p className='drop-down-item text-danger' onClick={handleLogout}>
                            <i className="bi bi-lock mx-2"></i>
                            {isLoading ? <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='purple.500'
                                size='md'
                            /> : "Logout"}
                        </p>
                    </div>
                </div>
            </div>

        </header >
    );
}

export default TopNav;
