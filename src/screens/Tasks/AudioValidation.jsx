import './style.scss';
import AudioPlayer from "../../components/AudioPlayer";
import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useToast, Spinner } from '@chakra-ui/react';
import { useGetAudioToValidateQuery, useValidateAudioMutation } from '../../features/resources/resources-api-slice';


function AudioValidation() {
    //HACK : offset is used to trigger a new request to the API
    const [offset, setOffset] = useState(0);

    const { data: response = {}, isFetching: isFetchingAudios, error: audioFetchingError } = useGetAudioToValidateQuery(offset);
    const [validateAudio, { isLoading: isValidatingAudio, error: audioValidationError }] = useValidateAudioMutation()
    const toast = useToast()
    const modalRef = useRef(null);
    const [currentImageLoading, setCurrentImageLoading] = useState(false);
    const [modal, setModal] = useState(null);
    const [isActionButtonDisabled, setIsActionButtonDisabled] = useState(true)
    const [isAudioBuffering, setIsAudioBuffering] = useState(true)

    let currentAudio = response["audio"]
    if (audioFetchingError) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${audioFetchingError.originalStatus}`,
            description: audioFetchingError.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }

    const handleLoadNewAudio = () => {
        // Loading audio
        setIsAudioBuffering(true)
        setIsActionButtonDisabled(true)
        setOffset(currentAudio?.id || -1)
    }

    useEffect(() => {
        if (modalRef.current !== null && modal === null) {
            const modal = new Modal(modalRef.current, { keyboard: false })
            setModal(modal)
        }
    })

    const showModal = () => {
        modal?.show()
    }

    const handleValidate = async (status) => {
        if (isValidatingAudio) return

        const body = { id: currentAudio?.id || -1, status }
        const response = await validateAudio(body).unwrap()
        if (response['message'] != null) {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: response['message'],
                status: 'success',
                duration: 1000,
                isClosable: true,
            })
        }
        // Next audio
        handleLoadNewAudio()
    }

    if (audioValidationError) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${audioValidationError.originalStatus}`,
            description: audioValidationError.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }

    const handleAudioEnded = () => {
        setIsActionButtonDisabled(false)
    }

    return (
        <section className='image-validation'>
            {currentAudio === undefined || currentAudio === null ?
                <div className="my-5">
                    <p className='text-warning text-center'><b>No more audios to validate</b></p>
                    <p className='text-center my-3'><button className='btn btn-primary' onClick={() => setOffset(-1)}>
                        {isFetchingAudios && <Spinner size={"sm"} />}
                        Reload
                    </button></p>
                </div> : null
            }

            {currentAudio &&
                <div ref={modalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{currentAudio.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                {currentImageLoading && <Spinner
                                    className='center-parent'
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    size="xl"
                                    color='purple.500'
                                />}
                                <img
                                    onLoad={() => setCurrentImageLoading(false)}
                                    onChange={() => setCurrentImageLoading(true)}
                                    className="image"
                                    style={{ "opacity": (currentImageLoading || isFetchingAudios) ? "0.5" : "1" }}
                                    src={currentAudio.image_url}
                                    alt="Described image" />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="container">
                {currentAudio &&
                    <div className="col-10 col-md-8 mx-auto d-flex justify-content-center align-items-center">
                        <p className='m-2'>Please verify whether the audio correctly describes the image below.</p>
                    </div>}

                <div className="col-10 col-md-8 mx-auto d-flex justify-content-center align-items-center">
                    {(currentImageLoading || isFetchingAudios) && <Spinner
                        className='center-parent'
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        size="xl"
                        color='purple.500'
                    />}
                    {currentAudio &&
                        <img onClick={showModal}
                            onLoad={() => setCurrentImageLoading(false)}
                            onChange={() => setCurrentImageLoading(true)}
                            className="image"
                            style={{ "opacity": (currentImageLoading || isFetchingAudios) ? "0.5" : "1", maxHeight: "50vh" }}
                            src={currentAudio.image_url}
                            alt="Described image" />}
                </div>
            </div>

            {currentAudio && !isFetchingAudios &&
                <div className='my-3 position-relative d-flex justify-content-center'>
                    <AudioPlayer
                        src={currentAudio["audio_url"]}
                        onEnded={handleAudioEnded}
                        setIsAudioBuffering={setIsAudioBuffering} />

                    {isAudioBuffering && <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        size="xl"
                        color='purple.500'
                    />}
                </div>
            }

            {currentAudio &&
                <div className="d-flex justify-content-center my-5 p-2 page-actions">
                    <button
                        className="btn btn-outline-danger me-2 px-3"
                        disabled={isValidatingAudio || isActionButtonDisabled}
                        onClick={() => handleValidate("rejected")}>
                        {isValidatingAudio ? <Spinner size="sm" /> :
                            <span><i className="bi bi-hand-thumbs-down me-1"></i>Reject</span>
                        }
                    </button>
                    <button
                        className="btn btn-outline-primary mx-3 px-3"
                        disabled={isValidatingAudio}
                        onClick={() => setOffset(currentAudio?.id || -1)}>
                        <span><i className="bi bi-skip-forward me-1"></i>Skip</span>
                    </button>
                    <button className="btn btn-outline-success me-2 px-3"
                        disabled={isValidatingAudio || isActionButtonDisabled}
                        onClick={() => handleValidate("accepted")}>
                        {isValidatingAudio ? <Spinner size="sm" /> :
                            <span><i className="bi bi-hand-thumbs-up me-1"></i>Accept</span>
                        }
                    </button>
                </div>}
        </section>
    );
}

export default AudioValidation;
