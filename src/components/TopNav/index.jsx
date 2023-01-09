import './style.scss';
import { Link } from "react-router-dom";
import { useLogOutUserMutation, logOutLocally } from '../../features/authentication/authentication-api-slice';
import { setActiveNavMenu } from '../../features/global/global-slice';
import { useSelector, useDispatch } from 'react-redux';
import { useToast, Spinner } from '@chakra-ui/react'
import PermissionUpdate from '../PermissionUpdate';
import Permissions from "../../utils/permissions";
import { useEffect, useState } from 'react';
import logo from "../../assets/images/logo.png";
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';

function TopNav() {
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const activeMenu = useSelector((state) => state.global.activeTopNavMenu);
    const user = useSelector((state) => state.authentication.user);
    const [notifications, setNotifications] = useState([]);

    const { trigger: getNotifications, data: responseData, error, isLoading: isLoadingNotifications } = useAxios({ mainUrl: `${BASE_API_URI}/notifications/` })

    const [logOutUser, { isLoading }] = useLogOutUserMutation()
    const dispatch = useDispatch();
    const toast = useToast()

    useEffect(() => {
        handleGetNotifications()
    }, [])

    const handleGetNotifications = () => {
        getNotifications()
    }

    useEffect(() => {
        if (responseData?.notifications) {
            setNotifications(responseData.notifications)
        }
    }, [responseData])

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

    useEffect(() => {
        const overlay = document.querySelector('.overlay');
        overlay.addEventListener('click', toggleMenu);
    }, [])

    const toggleMenu = () => {
        const menu = document.querySelector('.nav-left');
        const overlay = document.querySelector('.overlay');
        menu.classList.toggle('open');
        overlay.classList.toggle('open');
    }

    return (
        <header className="top-nav d-flex justify-content-between align-items-center">
            <div className='d-flex align-items-center'>
                <div className='d-md-none'>
                    <button className="btn btn-light" onClick={toggleMenu}><i className="bi bi-list"></i></button>
                </div>
                <Link to="/home" className='logo'>
                    <div className="d-flex">
                        <img className='logo' src={logo} alt="logo" />
                        <p style={{ fontWeight: "800" }}>Local Voice</p>
                    </div>
                </Link>
            </div>
            <div className="d-md-none overlay"></div>
            <div className='nav-left'>
                <Link to="/" className={`nav-menu-item ${activeMenu === 'home' ? 'active' : ''}`} onClick={() => setActiveMenu("home")}>DASHBOARD</Link>
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
                        <button className="btn btn-light btn-sm mx-2"
                            disabled={isLoadingNotifications}
                            onClick={handleGetNotifications}>
                            {isLoadingNotifications ? <span className='mx-1'><Spinner size="sm" /></span> : <i className="bi bi-bell mx-1"></i>}
                        </button>
                    </div>

                    <div className="drop-down">
                        {notifications.map((notification, index) => {
                            return <div className='drop-down-item'>
                                <p className='text-bold'>{notification.title}</p>
                                <p className="text-muted">
                                    {notification.message}
                                </p>
                                <div>
                                    <p className="my-2"><a href={notification.url}>{notification.url}</a></p>
                                    <p className="mt-2"><small className="text-muted">{notification.time_ago}</small></p>
                                </div>
                            </div>
                        })}

                    </div>
                </div>

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
