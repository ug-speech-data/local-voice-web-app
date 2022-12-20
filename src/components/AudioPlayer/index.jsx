import { useRef, useState } from 'react';
import './style.scss';
import { useToast } from '@chakra-ui/react'

function AudioPlayer({ src, onEnded, setIsAudioBuffering, className = '' }) {
    const [fullyPlayed, setFullyPlayed] = useState(false);
    const playerRef = useRef(null);
    const toast = useToast()
    let supposedCurrentTime = 0;

    const finishedPlaying = (e) => {
        setFullyPlayed(true);
        onEnded();
    }

    const onSeek = (e) => {
        if (!fullyPlayed) {
            const delta = playerRef.current.currentTime - supposedCurrentTime;
            if (delta > 0.01) {
                playerRef.current.currentTime = supposedCurrentTime;

                toast({
                    position: 'top-center',
                    title: `Can't seek forward`,
                    description: "Please you can only seek forward after the audio has finished playing",
                    status: 'info',
                    duration: 2000,
                    isClosable: true,
                })
            }
        }
    }

    const handleTimeupdate = (e) => {
        if (!playerRef.current.seeking) {
            supposedCurrentTime = playerRef.current.currentTime;
        }
    }


    return (
        <audio
            className={`text-big ${className}`}
            src={src}
            controlsList="nodownload"
            onEnded={finishedPlaying}
            onSeeking={onSeek}
            onCanPlay={() => setIsAudioBuffering(false)}
            preload="auto"
            ref={playerRef}
            onTimeUpdate={handleTimeupdate}
            controls
        />
    );
}

export default AudioPlayer;
