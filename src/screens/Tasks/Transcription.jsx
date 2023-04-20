import './style.scss';
import AudioPlayer from "../../components/AudioPlayer";
import { useState, useRef, useEffect, Fragment } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { useLazyGetAudioToTranscribeQuery, useSubmitTranscriptionMutation } from '../../features/resources/resources-api-slice';
import { Modal } from 'bootstrap';

function Transcription() {
    //HACK : offset is used to trigger a new request to the API
    const [offset, setOffset] = useState(0);
    const saveModalRef = useRef(null);
    const [saveModal, setSaveModal] = useState(null);

    const [getAudiosToTranscribe, { data: response = {}, isFetching: isFetchingAudio, error: audioFetchingError }] = useLazyGetAudioToTranscribeQuery(offset);
    const [submitTranscription, { isLoading: isSubmittingTranscription, error: audioValidationError }] = useSubmitTranscriptionMutation()
    const toast = useToast()
    const [text, setText] = useState('')
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
        getAudiosToTranscribe()
        setText('')
    }

    const handleSubmitTranscription = async () => {
        if (isSubmittingTranscription) return

        const body = { id: currentAudio?.id || -1, text }
        const response = await submitTranscription(body).unwrap()
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
        saveModal?.hide()
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

    useEffect(() => {
        if (saveModalRef.current !== null && saveModal === null) {
            const modal = new Modal(saveModalRef.current)
            setSaveModal(modal)
        }
    }, [])
    useEffect(() => {
        getAudiosToTranscribe()
    }, [])

    const showSaveModdal = () => {
        saveModal?.show()
    }

    return (
        <Fragment>
            <div ref={saveModalRef} className="modal fade" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-mg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm sumbission</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group my-3">
                                <p className='h6 text-center'>Are you sure you want to submit this transcription?</p>
                                <div className="my-3 d-flex justify-content-center">
                                    <button className="btn btn-primary"
                                        disabled={isSubmittingTranscription}
                                        onClick={() => handleSubmitTranscription("accepted")}
                                    >
                                        {isSubmittingTranscription && <span className="mx-2"><Spinner /></span>}
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <section className='image-validation'>
                {currentAudio === undefined || currentAudio === null ?
                    <div className="my-5">
                        <p className='text-warning text-center'><b>No more audios to transcribe</b></p>
                        <p className='text-center my-3'><button className='btn btn-primary' onClick={() => getAudiosToTranscribe()}>
                            {isFetchingAudio && <Spinner size={"sm"} />}
                            Reload
                        </button></p>
                    </div> : null
                }

                {currentAudio && !isFetchingAudio &&
                    <div className="my-5 position-relative">
                        <p className="text-center"><span className="badge bg-primary">Audio ID: {currentAudio.id}</span></p>
                        <p className="text-center"> Please transcribe the audio below as it is.</p>
                    </div>}

                {currentAudio && !isFetchingAudio && <p className='text-center'>{currentAudio.audio_url}</p>}

                {currentAudio === undefined ?
                    <div className="my-5 d-flex justify-content-center align-items-center">
                        <h2>No audios to transcribe</h2>
                    </div> : null
                }

                {currentAudio &&
                    <div className='my-3 position-relative d-flex justify-content-center'>
                        <AudioPlayer
                            src={currentAudio["audio_url"]}
                            onEnded={handleAudioEnded}
                            setIsAudioBuffering={setIsAudioBuffering} />

                        {(isAudioBuffering | isFetchingAudio) ? <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            size="xl"
                            color='purple.500'
                        /> : null}
                    </div>
                }

                {currentAudio && (isSubmittingTranscription || isActionButtonDisabled || text.length === 0) &&
                    <p className='text-center text-primary my-2'><b>Please play the full audio and input the transcription.</b></p>
                }

                {currentAudio &&
                    <div className="col-md-10 mx-auto transcription-box">
                        <div className="my-5 col-md-6 mx-auto">
                            {currentAudio.transcriptions.length > 0 ? <p className=""><strong>Previous Transcriptions</strong></p> : ""}
                            {currentAudio.transcriptions?.map((transcription, index) => {
                                return <div className='mb-3' style={{ "userSelect": "none" }}>
                                    <span className="badge bg-primary">{index + 1}</span>
                                    <p className="text-center transcribed-text-container" id={`text-${index}-container`}>{transcription.text}</p>
                                </div>
                            })}
                        </div>
                        <textarea className='form-control' value={text} rows="5" placeholder='Type here' onChange={e => setText(e.target.value)}></textarea>
                    </div>
                }

                {currentAudio &&
                    <div className="d-flex justify-content-center my-5 p-2 page-actions">
                        <button
                            className="btn btn-outline-primary mx-3 px-3"
                            disabled={isSubmittingTranscription}
                            onClick={() => getAudiosToTranscribe(currentAudio?.id || -1)}>
                            <span><i className="bi bi-skip-forward me-1"></i>Skip</span>
                        </button>
                        <button className="btn btn-outline-success me-2 px-3"
                            disabled={isSubmittingTranscription || isActionButtonDisabled || text.length === 0}
                            onClick={() => showSaveModdal()}>
                            {isSubmittingTranscription ? <Spinner size="sm" /> :
                                <span><i className="bi bi-check me-1"></i>Submit</span>
                            }
                        </button>
                    </div>
                }
            </section>
        </Fragment>
    );
}

export default Transcription;
