import './style.scss';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useLogOutUserMutation, logOutLocally } from '../../features/authentication/authentication-api-slice';
import { useSelector, useDispatch } from 'react-redux';
import { useToast, Spinner } from '@chakra-ui/react'

function TopNav() {
    const user = useSelector((state) => state.authentication.user);
    const [logOutUser, { isLoading }] = useLogOutUserMutation()
    const dispatch = useDispatch();
    const toast = useToast()
    const [activeMenu, setActiveMenu] = useState('home')

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

    return (
        <header className="top-nav d-flex justify-content-between">
            <div className='nav-left'>
                <Link to="/" className={`nav-menu-item ${activeMenu === 'home' ? 'active' : ''}`} onClick={() => setActiveMenu("home")}>HOME</Link>
                <Link to="/tasks" className={`nav-menu-item ${activeMenu === 'validation' ? 'active' : ''}`} onClick={() => setActiveMenu("validation")}>VALIDATION AND TRANSCRIPTION</Link>
                <Link to="/collected-data" className={`nav-menu-item ${activeMenu === 'collected-data' ? 'active' : ''}`} onClick={() => setActiveMenu("collected-data")}>COLLECTED DATA</Link>
            </div>
            <div className='nav-right'>
                <Link to="" className={`nav-menu-item ${activeMenu === 'setup' ? 'active' : ''}`} onClick={() => setActiveMenu("setup")}>SETUP</Link>
                <Link to="" className={`nav-menu-item ${activeMenu === user.email_address ? 'active' : ''}`} onClick={() => setActiveMenu(`{ user.email_address }`)}>{user.email_address}</Link>
                <button className='btn btn-light' onClick={handleLogout}>
                    {isLoading ? <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='purple.500'
                        size='md'
                    /> : "Logout"}

                </button>
            </div>
        </header>
    );
}

export default TopNav;
