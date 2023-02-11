import './style.scss';
import React, { Fragment, useState } from 'react'
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import { useToast, Spinner } from '@chakra-ui/react'
import logo from "../../assets/images/logo.png";
import { Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useLoginUserMutation, setUser as setStoreUser, setToken, setUserPermissions } from '../../features/authentication/authentication-api-slice';


function LoginScreen() {
    const toast = useToast()
    const [loginUser, { isLoading }] = useLoginUserMutation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault()

        const body = { email_address: email, password: password }
        try {
            const response = await loginUser(body).unwrap()
            if (response['error_message'] != null) {
                toast({
                    position: 'top-center',
                    title: `An error occurred`,
                    description: response['error_message'],
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                // Save token to local storage
                localStorage.setItem('token', response['token'])
                localStorage.setItem('user', JSON.stringify(response['user']))
                localStorage.setItem('user_permissions', JSON.stringify(response['user_permissions']))

                toast({
                    position: 'top-center',
                    title: 'Login successful',
                    description: 'You have successfully logged in',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })

                setUser(response['user'])
                dispatch(setStoreUser(response['user']));
                dispatch(setToken(setToken['token']));
                dispatch(setUserPermissions(response['user_permissions']))
            }
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
        <Fragment>
            {user && (
                <Navigate to="/dashboard" replace={true} />
            )}
            <div className="login-page">
                <form className="col-md-4 col-10 mx-auto login-card" onSubmit={handleLogin}>
                    <div className="d-flex justify-content-center">
                        <img className='app-logo' src={logo} alt="logo" />
                    </div>

                    <h1 className='text-center h1 my-5'>LOGIN</h1>
                    <div className="d-flex justify-content-center">
                        {isLoading && <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='purple.500'
                            size='xl'
                        />}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email"
                            className="form-control"
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter email" required />
                    </div>

                    <div className="form-group my-3">
                        <label htmlFor="password">Password</label>
                        <input type="password"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                            id="password" aria-describedby="emailHelp"
                            placeholder="Enter password" required />
                        <p className="text-end"><Link>Forgot Password</Link></p>
                    </div>
                    <div className="form-group my-3">
                        <p className="text-center">
                            <button className='btn btn-primary'>Login</button>
                        </p>
                    </div>

                    <div className="form-group my-3">
                        <Link to="/register">Don't have an account? Register here</Link>
                    </div>
                </form>
                <Footer />
            </div>
        </Fragment>
    );
}

export default LoginScreen;
