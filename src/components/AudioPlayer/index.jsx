import { useState } from 'react';
import './style.scss';
import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react';

function AudioPlayer({ src, onEnded = () => null, setIsAudioBuffering = () => null, className = '' }) {
    const [audioPlayer, setAudioPlayer] = useState(null);
    const [fullyPlayed, setFullyPlayed] = useState(false);

    const toast = useToast()
    const [playerPosition, setPlayerPosition] = useState(0)
    const [playerDuration, setPlayerDuration] = useState("00:00")
    const [totalDuration, setTotalDuration] = useState("00:00")

    const finishedPlaying = (event) => {
        setFullyPlayed(true);
        onEnded();
    }

    useEffect(() => {
        const audioPlayer = new Audio()
        audioPlayer.preload = "auto"
        audioPlayer.ontimeupdate = handleTimeupdate
        audioPlayer.oncanplay = function () { setIsAudioBuffering(false) }
        audioPlayer.oncanplaythrough = onLoaded
        audioPlayer.onended = finishedPlaying
        audioPlayer.src = src
        setAudioPlayer(audioPlayer)
    }, [])

    const onSeek = (event) => {
        if (audioPlayer === null)
            return
        if (!fullyPlayed) {
            event.preventDefault()
            toast({
                position: 'top-center',
                title: `Can't seek forward`,
                description: "Please you can only seek after the audio has finished playing",
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
        } else {
            audioPlayer.currentTime = Math.floor(event.target.value / 100 * audioPlayer.duration);
            setPlayerPosition(event.target.value)
        }
    }

    function str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    function onLoaded(event) {
        const duration = Math.floor(event.target.duration)
        const seconds = duration % 60
        const minutes = Math.floor(duration / 60);
        const finalTime = str_pad_left(minutes.toString(), '0', 2) + ':' + str_pad_left(seconds.toString(), '0', 2);
        setTotalDuration(finalTime)
    }

    const handleTimeupdate = (event) => {
        if (event.target.currentTime) {
            const duration = Math.floor(event.target.currentTime)
            const seconds = duration % 60
            const minutes = Math.floor(duration / 60);
            const finalTime = str_pad_left(minutes.toString(), '0', 2) + ':' + str_pad_left(seconds.toString(), '0', 2);
            setPlayerDuration(finalTime)
            setPlayerPosition(Math.floor(event.target.currentTime / event.target.duration * 100))
        }
    }

    function playPause() {
        if (!audioPlayer?.paused) {
            audioPlayer?.pause()
        }
        else {
            audioPlayer?.play()
        }
    }

    return (
        <div className='audio-player'>
            <div className="controls">
                <button className="play-button" onClick={playPause}>
                    {audioPlayer?.paused == true && <i className="bi bi-play-fill"></i>}
                    {(!audioPlayer?.paused) == true && <i className="bi bi-pause-fill"></i>}
                </button>
                <input id='progress-bar' type="range" value={playerPosition} onChange={onSeek} />
                <span id='timer'>{playerDuration}/{totalDuration}</span>
            </div>
        </div>
    );
}

export default AudioPlayer;
