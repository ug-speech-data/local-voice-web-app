import './style.scss';
import React, { Fragment } from 'react'
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import logo from "../../assets/images/logo.png";

function Error401Screen() {

    return (
        <Fragment>
            <div className="error-page">
                <div className="content">
                    <img src={logo} alt="logo" style={{ "height": "10em" }} />
                    <h1 style={{ "fontSize": "10em" }}>401</h1>
                    <h2>Unauthorized</h2>
                    <p>Sorry, you are not authorized to access this page.</p>
                    <div className="d-flex">
                        <Link to="/" className="mx-2 btn btn-primary">Home</Link>
                        <Link to="/login" className="mx-2 btn btn-primary">Login</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Error401Screen;
