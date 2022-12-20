import './style.scss';
import AudioPlayer from "../../components/AudioPlayer";
import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useToast, Spinner } from '@chakra-ui/react';
import { useGetAudiosToValidateQuery, useValidateAudioMutation } from '../../features/resources/resources-api-slice';
import { mod } from '../../utils/functions';


function AudioValidation() {
    let totalPages = 0;
    const [page, setPage] = useState(1)
    const { data: response = [], isFetching: isFetchingAudios, error: audioFetchingError } = useGetAudiosToValidateQuery(page);
    const [validateAudio, { isLoading: isValidatingAudio, error: audioValidationError }] = useValidateAudioMutation()
    const toast = useToast()
    const modalRef = useRef(null);
    const [currentImageLoading, setCurrentImageLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [audioIndex, setAudioIndex] = useState(0);
    const [isActionButtonDisabled, setIsActionButtonDisabled] = useState(true)
    const [isAudioBuffering, setIsAudioBuffering] = useState(true)

    const responseData = response["audios"]
    const [workingAudios, setWorkingAudios] = useState(responseData !== undefined ? [...responseData] : [])
    const returnAudioLength = responseData !== undefined ? responseData.length : 0

    let currentAudio = null;
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

    if (workingAudios !== undefined) {
        currentAudio = workingAudios[audioIndex]
        totalPages = response["pages"]
    }

    const handleAudioChange = (index) => {
        setAudioIndex(mod(index, workingAudios.length));
        currentAudio = workingAudios[audioIndex]

        // Loading audio
        setCurrentImageLoading(true)
        setIsAudioBuffering(true)
        setIsActionButtonDisabled(true)
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

        const body = { image_id: 1, status }
        const response = await validateAudio(body).unwrap()
        if (response['message'] != null) {
            // Remove audio from list
            workingAudios.splice(audioIndex, 1)

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
        handleAudioChange(audioIndex + 1)
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

    useEffect(() => {
        console.log("useEffect", "useEffect")
    })

    return (
        <section className='image-validation'>
            <div className="my-3 d-flex justify-content-end position-relative">
                <button className="btn btn-sm btn-primary" onClick={() => setPage(mod(page - 1, totalPages))}>Previous</button>
                <span className="mx-2">Page {page} of {totalPages}</span>
                <button className="btn btn-sm btn-primary me-5" onClick={() => setPage(mod(page + 1, totalPages))}>Next</button>
                <span className="me-4"></span>
                <span className="balloon">{returnAudioLength - workingAudios.length}/{returnAudioLength}</span>
            </div>

            {workingAudios === undefined || workingAudios.length === 0 ?
                <div className="my-5 d-flex justify-content-center align-items-center">
                    <h2>No audios to validate</h2>
                </div> : null
            }

            {isFetchingAudios &&
                <div className="my-3 d-flex justify-content-center align-items-center">
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='purple.500'
                        size='xl' />
                </div>
            }

            {currentAudio && !isFetchingAudios &&
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
                                <img onClick={showModal}
                                    onLoad={() => setCurrentImageLoading(false)}
                                    className="image"
                                    style={{ "opacity": currentImageLoading ? "0.5" : "1" }}
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

            {currentAudio && !isFetchingAudios &&
                <div className="row">
                    <div className="col-1 col-md-2 d-flex align-items-center justify-content-end">
                        <button className="btn-control text-muted" onClick={() => handleAudioChange(audioIndex - 1)}>
                            <i className="bi bi-arrow-left"></i>
                        </button>
                    </div>

                    <div className="col-10 col-md-8 d-flex justify-content-center align-items-center">
                        {currentImageLoading && <Spinner
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
                                className="image"
                                style={{ "opacity": currentImageLoading ? "0.5" : "1" }}
                                src={currentAudio.image_url}
                                alt="Described image" />}
                    </div>
                    <div className="col-1 col-md-2 d-flex align-items-center justify-content-start">
                        <button className="btn-control text-muted" onClick={() => handleAudioChange(audioIndex + 1)}>
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            }

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

            <div className="d-flex justify-content-center my-5 page-actions">
                <button
                    className="btn btn-outline-danger me-2 p-3"
                    disabled={isValidatingAudio || isActionButtonDisabled}
                    onClick={() => handleValidate("rejected")}>
                    {isValidatingAudio ? <Spinner size="sm" /> :
                        <span><i className="bi bi-hand-thumbs-down"></i>Reject</span>
                    }
                </button>
                <button className="btn btn-outline-success me-2 p-3"
                    disabled={isValidatingAudio || isActionButtonDisabled}
                    onClick={() => handleValidate("accepted")}>
                    {isValidatingAudio ? <Spinner size="sm" /> :
                        <span><i className="bi bi-hand-thumbs-up"></i>Accept</span>
                    }
                </button>
            </div>
        </section>
    );
}

export default AudioValidation;
