import './style.scss';
import Lottie from "lottie-react";
import lottiePlayFile from "../../assets/lottie/play_button.json";
import { useRef, useState,useEffect } from 'react';


function PlayButton({ onClick }) {
    const lottieRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const buttonClicked = () => {
        onClick();
        isPlaying ? lottieRef.current.pause() : lottieRef.current.play();
        setIsPlaying(!isPlaying);
    }

    useEffect(() => {
        lottieRef.current.setSpeed(2);
    },[])

    return (
        <Lottie className='lottie-button' lottieRef={lottieRef} animationData={lottiePlayFile} listen loop={true} autoplay={false} onClick={buttonClicked} />
    );
}

export default PlayButton;
