import './style.scss';
import { Fragment } from "react";
import { Link } from "react-router-dom";
import AudioPlayer from "../../components/AudioPlayer";

function Transcription() {
    return (
        <Fragment>
            <div className="my-3 d-flex justify-content-between">
                <Link className="text-muted">Previous</Link>
                <Link className="text-muted">Skip</Link>
            </div>

            <div className='d-flex justify-content-center my-3'>
                <AudioPlayer />
            </div>

            <div className="transcription-box">
                <textarea className='form-control' name="" id="" rows="5" placeholder='Type here'>

                </textarea>
            </div>
            <p className="text-end my-3"><button className='btn btn-primary'>Submit</button></p>
        </Fragment>
    );
}

export default Transcription;
