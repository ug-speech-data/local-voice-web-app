import './style.scss';
import { Fragment } from "react";
import { Link } from "react-router-dom";
import logo from "../../logo.svg";
import PlayButton from "../../components/PlayButton";
import testWave from '../../assets/audio/test.wav'

let audio = new Audio(testWave);

function Transcription() {

    const playPause = () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    return (
        <Fragment>
            <div className="my-3 d-flex justify-content-between">
                <Link className="text-muted">Previous</Link>
                <Link className="text-muted">Skip</Link>
            </div>

            <p className="mx-auto col-md-6 text text-center">
                <img className="image" src={logo} alt="Described image" />
            </p>

            <div className='d-flex justify-content-center my-3'> <PlayButton onClick={playPause} isPlaying={false} /></div>

            <div className="transcription-box">
                <textarea className='form-control' name="" id="" rows="5" placeholder='Type here'>

                </textarea>
            </div>
            <p className="text-end my-3"><button className='btn btn-primary'>Submit</button></p>
        </Fragment>
    );
}

export default Transcription;
