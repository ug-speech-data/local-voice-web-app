import './style.scss';
import React, { Fragment } from 'react'
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import logo from "../../assets/images/logo.png";

function Error404Screen() {

    return (
        <Fragment>
            <div className="error-page">
                <div className="content">
                    <img src={logo} alt="logo" style={{ "height": "10em" }} />
                    <h1 style={{ "fontSize": "10em" }}>404</h1>
                    <h2>Not Found</h2>
                    <p>Sorry, the requested resource is not found.</p>
                    <div className="d-flex">
                        <Link to="/" className="mx-2 btn btn-primary">Home</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Error404Screen;
