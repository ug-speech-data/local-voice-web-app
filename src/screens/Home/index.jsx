import './style.scss';
import React, { useState, useEffect } from 'react'
import useAxios from '../../app/hooks/useAxios';
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";


function HomeScreen() {
    const { trigger: getWebConfigurations, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/web-app-configurations`, useAuthorisation: false });
    const [webConfigurations, setWebConfigurations] = useState(null);
    const toast = useToast();

    useEffect(() => {
        getWebConfigurations();
    }, []);

    useEffect(() => {
        if (responseData?.configurations) {
            setWebConfigurations(responseData.configurations);
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
            <div className="content">
                <h1 className='text-center h1'>LOCAL VOICE PROJECT</h1>
                <p className='text-center'>Our website is under construction. Below are some helpful resources for the meantime.</p>

                <div className='text-center my-4 d-flex mx-auto justify-content-center align-items-center flex-wrap'>
                    <Link to={'/login'} className="mx-4 my-2">
                        <button className="btn btn-outline-primary"><i className="bi bi-lock"></i> Login</button>
                    </Link>
                    <Link to={'/'} className="mx-4 my-2">
                        <button className="btn btn-outline-primary"><i className="bi bi-grid-fill"></i> Dashboard</button>
                    </Link>
                    {webConfigurations?.android_apk_url && <a href={webConfigurations.android_apk_url} className="mx-4 my-2">
                        <button className="btn btn-primary"><i className="bi bi-android2"></i> GET OUR APK</button>
                    </a>}
                </div>
            </div>
        </div>
    );
}

export default HomeScreen;
