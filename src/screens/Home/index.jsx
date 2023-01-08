import './style.scss';
import React, { useState, useEffect } from 'react'
import useAxios from '../../app/hooks/useAxios';
import { BASE_API_URI } from '../../utils/constants';
import { Link } from 'react-router-dom';


function HomeScreen() {
    const { trigger: getWebConfigurations, data: responseData, error, isLoading } = useAxios(`${BASE_API_URI}/web-app-configurations`);
    const [webConfigurations, setWebConfigurations] = useState(null);

    useEffect(() => {
        getWebConfigurations();
    }, []);

    useEffect(() => {
        if (responseData?.configurations) {
            setWebConfigurations(responseData.configurations);
        }
    }, [responseData]);

    return (
        <div className="home-page">
            <div className="content">
                <h1 className='text-center h1'>LOCAL VOICE PROJECT</h1>
                <p className='text-center'>Our website is under construction. Below are helpful some resources for the meantime.</p>

                <div className='text-center my-4 d-flex mx-auto justify-content-center align-items-center flex-wrap'>
                    <Link to={'/login'} className="mx-4 my-2">
                        <button className="btn btn-outline-primary">Login</button>
                    </Link>
                    {webConfigurations?.android_apk_url && <a href={webConfigurations.android_apk_url} className="mx-4 my-2">
                        <button className="btn btn-primary">Get Our APK</button>
                    </a>}
                </div>
            </div>
        </div>
    );
}

export default HomeScreen;
