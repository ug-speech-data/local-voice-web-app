import './style.scss';
import { Fragment } from "react";
import { Link } from "react-router-dom";
import logo from "../../logo.svg";
import testWave from '../../assets/audio/test.wav'

let audio = new Audio(testWave);

function ImageValidation() {
    return (
        <Fragment>
            <div className="my-3 d-flex justify-content-between">
                <Link className="text-muted">Previous</Link>
                <Link className="text-muted">Skip</Link>
            </div>

            <p className="col-md-6 mx-auto">
                <img className="image" src={logo} alt="Described image" />
            </p>
            <div className="col-md-6 mx-auto my-4">
                <div className='my-2'>
                    <p className='m-0 p-0'><b>Name</b></p>
                    <p className='m-0 p-0'>Car Logo</p>
                </div>

                <div className='my-3'>
                    <p className='m-0 p-0'><b>Category</b></p>
                    <p className='m-0 p-0'>Category 1</p>
                </div>

            </div>

            <div className="d-flex justify-content-center my-4">
                <button className="btn btn-outline-primary me-2"> <i className="bi bi-hand-thumbs-down"></i> Reject</button>
                <button className="btn btn-outline-primary me-2"> <i className="bi bi-hand-thumbs-up"></i> Accept</button>
            </div>
        </Fragment>
    );
}

export default ImageValidation;
