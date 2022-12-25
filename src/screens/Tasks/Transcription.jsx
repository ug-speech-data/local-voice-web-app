import './style.scss';
import AudioPlayer from "../../components/AudioPlayer";
import { useState, useEffect } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { useGetAudioToValidateQuery, useSubmitTranscriptionMutation } from '../../features/resources/resources-api-slice';

function Transcription() {
    //HACK : index is used to trigger a new request to the API
    const [index, setIndex] = useState(0);

    const { data: response = {}, isFetching: isFetchingAudio, error: audioFetchingError } = useGetAudioToValidateQuery(index);
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
        setIndex(index + 1)
        setText('')
    }

    const handleSubmitTranscription = async () => {
        if (isSubmittingTranscription) return

        const body = { audio_id: 1, text }
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
            <div className="my-5 d-flex justify-content-center position-relative">
                <p>Please transcribe the audio below as it is.</p>
            </div>

            {currentAudio && !isFetchingAudio && <p className='text-center'>{currentAudio.name}</p>}

            {currentAudio === undefined ?
                <div className="my-5 d-flex justify-content-center align-items-center">
                    <h2>No audios to validate</h2>
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

            <div className="col-md-10 mx-auto transcription-box">
                <textarea className='form-control' value={text} rows="5" placeholder='Type here' onChange={e => setText(e.target.value)}>
                </textarea>
            </div>

            <div className="d-flex justify-content-center my-5 p-2 page-actions">
                <button
                    className="btn btn-outline-primary mx-3 px-3"
                    disabled={isSubmittingTranscription}
                    onClick={() => setIndex(index + 1)}>
                    <span><i className="bi bi-skip-forward me-1"></i>Skip</span>
                </button>
                <button className="btn btn-outline-success me-2 px-3"
                    disabled={isSubmittingTranscription || isActionButtonDisabled || text.length === 0}
                    onClick={() => handleSubmitTranscription("accepted")}>
                    {isSubmittingTranscription ? <Spinner size="sm" /> :
                        <span><i className="bi bi-hand-thumbs-up me-1"></i>Accept</span>
                    }
                </button>
            </div>
        </section>
    );
}

export default Transcription;
