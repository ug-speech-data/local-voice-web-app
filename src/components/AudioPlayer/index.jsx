import { useState } from 'react';
import './style.scss';
import { useToast } from '@chakra-ui/react'
import { useMemo } from 'react';
import { useEffect } from 'react';

function AudioPlayer({ src, onEnded = () => null, setIsAudioBuffering = () => null, className = '' }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [fullyPlayed, setFullyPlayed] = useState(false);

    const toast = useToast()
    const [playerPosition, setPlayerPosition] = useState(0)
    const [playerDuration, setPlayerDuration] = useState("00:00")
    const [totalDuration, setTotalDuration] = useState("00:00")

    const finishedPlaying = (event) => {
        setFullyPlayed(true);
        setIsPlaying(false)
        onEnded();
    }

    const onSeek = (event) => {
        if (audioPlayer === null)
            return
        if (!fullyPlayed) {
            event.preventDefault()
            toast.close("seeking-error")
            toast({
                id: "seeking-error",
                position: 'top-center',
                title: `Cannot seek until done playing`,
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
        if (audioPlayer?.paused == false) {
            audioPlayer?.pause()
            setIsPlaying(false)
        }
        else if (audioPlayer?.paused == true) {
            audioPlayer?.play()
            setIsPlaying(true)
        }
    }

    const audioPlayer = useMemo(() => {
        const player = new Audio()
        player.preload = "auto"
        player.ontimeupdate = handleTimeupdate
        player.oncanplay = function () { setIsAudioBuffering(false) }
        player.onloadedmetadata = onLoaded
        player.onended = finishedPlaying
        player.src = src
        player.currentTime = 0
        return player
    }, [])

    useEffect(() => {
        setPlayerPosition(0)
        setPlayerDuration("00:00")
        audioPlayer?.pause()
        setIsPlaying(false)
        setFullyPlayed(false);
        if (audioPlayer != null) {
            audioPlayer.currentTime = 0
            audioPlayer.src = src
        }
    }, [src])


    // Component will unmount
    useEffect(() => {
        return () => {
            audioPlayer?.pause()
        }
    }, [])

    return (
        <div className='audio-player'>
            <div className="controls">
                <button className="play-button" onClick={playPause}>
                    {!isPlaying && <i className="bi bi-play-fill"></i>}
                    {isPlaying && <i className="bi bi-pause-fill"></i>}
                </button>
                <input id='progress-bar' type="range" value={playerPosition} onChange={onSeek} />
                <span id='timer'>{playerDuration}/{totalDuration}</span>
            </div>
        </div>
    );
}

export default AudioPlayer;
