import './style.scss';
import { Fragment } from "react";
import { Link } from "react-router-dom";
import AudioPlayer from "../../components/AudioPlayer";
import logo from "../../assets/images/logo.png";

function AudioValidation() {
    return (
        <Fragment>
            <div className="my-3 d-flex justify-content-between">
                <Link className="text-muted">Previous</Link>
                <Link className="text-muted">Skip</Link>
            </div>

            <div className="col-md-8 mx-auto">
                <img className="image" src={logo} alt="Described image" />
            </div>


            <div className='d-flex justify-content-center my-3'>
                <AudioPlayer />
            </div>


            <div className="d-flex justify-content-center my-4">
                <button className="btn btn-outline-primary me-2"> <i className="bi bi-hand-thumbs-down"></i> Reject</button>
                <button className="btn btn-outline-primary me-2"> <i className="bi bi-hand-thumbs-up"></i> Accept</button>
            </div>
        </Fragment>
    );
}

export default AudioValidation;
