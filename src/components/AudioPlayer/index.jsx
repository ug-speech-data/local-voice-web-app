import './style.scss';
import ReactAudioPlayer from 'react-audio-player';
import testWave from '../../assets/audio/test.wav'

function AudioPlayer() {
    return (
        <ReactAudioPlayer
            src={testWave}
            controls
        />
    );
}

export default AudioPlayer;
