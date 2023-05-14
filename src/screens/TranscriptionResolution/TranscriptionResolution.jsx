import AudioPlayer from "../../components/AudioPlayer";
import { useState, useRef, useEffect, Fragment } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { Modal } from 'bootstrap';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { needlemanWunsch } from "../../utils/functions";

function TranscriptionResolution() {
    const navigate = useNavigate();

    const { trigger: getTranscriptionToResolve, data: transcriptionResonse, error: errorGettingResolution, isLoading: isGettingResolution } = useAxios({ mainUrl: BASE_API_URI + '/get-transcription-to-resolve' })
    const { trigger: submitTranscriptionResolution, data: resolutionResponse, error: errorSubmittingResolution, isLoading: isSubmittingResolution } = useAxios({ method: "POST" })

    const saveModalRef = useRef(null);
    const [saveModal, setSaveModal] = useState(null);
    const toast = useToast()
    const [isAudioBuffering, setIsAudioBuffering] = useState(true)
    const [currentAudio, setCurrentAudio] = useState(null);
    const [correctedText, setCorrectedText] = useState('');


    const handleSubmitTranscription = async (status) => {
        if (isSubmittingResolution) return
        const body = { id: currentAudio?.id || -1, "text": correctedText, "transcription_status": status }
        submitTranscriptionResolution(
            `${BASE_API_URI}/get-transcription-to-resolve/`,
            body
        )
        saveModal?.hide()
    }

    const showSaveModdal = () => {
        saveModal?.show()
    }

    useEffect(() => {
        if (saveModalRef.current !== null && saveModal === null) {
            const modal = new Modal(saveModalRef.current)
            setSaveModal(modal)
        }
    }, [])

    useEffect(() => {
        getTranscriptionToResolve()
    }, [])

    useEffect(() => {
        setCurrentAudio(transcriptionResonse?.audio)
    }, [transcriptionResonse])

    useEffect(() => {
        if (currentAudio?.transcriptions.length > 0 == true) {
            setCorrectedText(currentAudio?.transcriptions[0].corrected_text)
        }
        highlight(`text-0-container`, `text-1-container`)
    }, [currentAudio])

    useEffect(() => {
        if (Boolean(resolutionResponse?.message)) {
            toast.close("update-toast")
            toast({
                id: "update-toast",
                position: 'top-center',
                title: `Attention`,
                description: resolutionResponse.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
            getTranscriptionToResolve()
        }
    }, [resolutionResponse])

    useEffect(() => {
        if (Boolean(errorSubmittingResolution) && !isSubmittingResolution) {
            toast({
                position: 'top-center',
                title: `Attention`,
                description: errorSubmittingResolution,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorSubmittingResolution, isSubmittingResolution])

    useEffect(() => {
        if (Boolean(errorGettingResolution) && !isGettingResolution) {
            toast({
                position: 'top-center',
                title: `Attention`,
                description: errorGettingResolution,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorGettingResolution, isGettingResolution])

    function highlight(newId, oldId) {
        const oldElem = document.getElementById(oldId)
        const newElem = document.getElementById(newId)
        if (!Boolean(oldElem) || !Boolean(newElem)) return

        let oldText = oldElem?.innerText.toLowerCase();
        let newText = newElem?.innerText.toLowerCase();

        const res = needlemanWunsch(oldText, newText)
        oldText = res[0]
        newText = res[1]

        let text = '';
        newText.split('').forEach(function (val, i) {
            if (val != oldText?.charAt(i)) {
                if (val === " ") {
                    text += "<span class='highlight'>&nbsp;";
                } else {
                    text += "<span class='highlight'>" + val;
                }
                text += "</span>";
            }
            else
                text += val;
        });
        if (Boolean(newElem)) {
            newElem.innerHTML = text
        }
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
                                        disabled={isSubmittingResolution}
                                        onClick={() => handleSubmitTranscription("accepted")}
                                    >
                                        {isSubmittingResolution && <span className="mx-2"><Spinner /></span>}
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
            {isGettingResolution ?
                <section className="col-md-10 mx-auto col-11 d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        size="lg"
                        color='purple.500'
                    />
                </section>
                :

                <section className="col-md-10 mx-auto col-11">
                    <div className="d-flex justify-content-end py-4">
                        <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)} aria-label="Close"><i className="bi bi-x-lg"></i></button>
                    </div>

                    {Boolean(currentAudio) ?
                        <Fragment>
                            <div className="my-3">
                                <strong className="modal-title my-2"><a href={currentAudio?.audio_url}>{currentAudio?.audio_url}</a></strong>
                                <hr />
                            </div>
                            <div className="modal-body d-flex align-items-center justify-content-center flex-wrap">
                                <div className="col-md-6 d-flex align-items-center justify-content-center p-2">
                                    <img src={currentAudio?.image_url} alt={currentAudio?.audio_url} style={{ maxHeight: "40vh" }} />
                                </div>
                                <div className="col-md-6">
                                    <div className="my-3">
                                        <label htmlFor="name" className="form-label"><b>Locale</b></label>
                                        <p className="text-justify">{currentAudio?.locale}</p>
                                    </div>

                                    <div className="my-3">
                                        <label htmlFor="name" className="form-label"><b>Audio</b> <span className="badge bg-primary">{currentAudio?.id}</span></label>
                                        <div className="d-flex justify-content-start align-items-center">
                                            <AudioPlayer
                                                canSeek={true}
                                                src={currentAudio?.audio_url}
                                                setIsAudioBuffering={setIsAudioBuffering} />

                                            {currentAudio && isAudioBuffering && <Spinner
                                                thickness='4px'
                                                speed='0.65s'
                                                emptyColor='gray.200'
                                                size="lg"
                                                color='purple.500'
                                            />}
                                        </div>
                                    </div>

                                    <div className="my-3">
                                        <p htmlFor="name" className="m-0"><b>Transcriptions</b></p>
                                        {currentAudio?.transcriptions?.map((transcription, index) => {
                                            const parent = <div className='mb-3' key={index}>
                                                <p className='text-primary d-flex align-items-center flex-wrap my-3'><strong>Text {index + 1} <span className="badge bg-primary">{transcription.id}</span></strong>
                                                    <button className="btn btn-sm btn-light d-flex align-items-center" onClick={(e) => setCorrectedText(transcription.text)}>
                                                        <i className="bi bi-pencil me-1"></i><small>Edit this</small>
                                                    </button>

                                                    <span className="badge bg-primary">{transcription.user.phone}</span>
                                                    <span className="badge mx-2 bg-primary">{transcription.user.email_address}</span>
                                                </p>
                                                <p className="text-justify transcribed-text-container" id={`text-${index}-container`}>{transcription.text}</p>
                                            </div>
                                            return parent;
                                        })}
                                        <hr />
                                        <p htmlFor="name" className="mt-3"><b>Edit (Resolution)</b></p>
                                        <small className='text-muted'>Edit and save</small>
                                        <textarea className='form-control' rows="5" placeholder='Type here' value={correctedText} onChange={(e) => setCorrectedText(e.target.value)}></textarea>
                                    </div>

                                    <div className="my-3 d-flex justify-content-end">
                                        <button className="btn btn-outline-primary btn-sm mx-3"
                                            disabled={Boolean(correctedText)}
                                            onClick={() => getTranscriptionToResolve(`${BASE_API_URI}/get-transcription-to-resolve?offset=${currentAudio.id}`)}>{isSubmittingResolution && <Spinner />} Skip</button>
                                        <button className="btn btn-primary btn-sm"
                                            disabled={isSubmittingResolution || !Boolean(correctedText)}
                                            onClick={showSaveModdal}>{isSubmittingResolution && <Spinner />} Submit</button>
                                    </div>
                                </div>
                            </div>
                        </Fragment> :
                        <section className="col-md-10 mx-auto col-11" style={{ height: "40vh" }}>
                            <p className="text-center text-warning"><strong>No more audios resolve</strong></p>
                            <p className="text-center my-5">
                                <button onClick={() => getTranscriptionToResolve()} className="btn btn-primary">Reload</button>
                            </p>
                        </section>
                    }
                </section>
            }
            <Footer />
        </Fragment>
    );
}

export default TranscriptionResolution;
