import './style.scss';
import AudioPlayer from "../../components/AudioPlayer";
import { useState } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { useGetAudioToValidateQuery, useValidateAudioMutation } from '../../features/resources/resources-api-slice';

function TranscriptionValidation() {
    //HACK : index is used to trigger a new request to the API
    const [index, setIndex] = useState(0);

    const { data: response = {}, isFetching: isFetchingAudio, error: audioFetchingError } = useGetAudioToValidateQuery(index);
    const [validateAudio, { isLoading: isValidatingAudio, error: audioValidationError }] = useValidateAudioMutation()
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

    const handleValidate = async () => {
        if (isValidatingAudio) return

        const body = { audio_id: 1, text }
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
            <div className="my-5 d-flex justify-content-center position-relative">
                <p>Please verify whether the text is a word-for-word transcription of the audio..</p>
            </div>

            {currentAudio === undefined ?
                <div className="my-5 d-flex justify-content-center align-items-center">
                    <h2>No audios to validate</h2>
                </div> : null
            }

            <div className="col-md-10 mx-auto transcription-box">
                <p className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, quas.</p>
            </div>

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
                    onClick={() => setIndex(index + 1)}>
                    <span><i className="bi bi-skip-forward me-1"></i>Skip</span>
                </button>
                <button className="btn btn-outline-success me-2 px-3"
                    disabled={isValidatingAudio || isActionButtonDisabled}
                    onClick={() => handleValidate("accepted")}>
                    {isValidatingAudio ? <Spinner size="sm" /> :
                        <span><i className="bi bi-hand-thumbs-up me-1"></i>Accept</span>
                    }
                </button>
            </div>

            {/* <div className="d-flex justify-content-center my-5 p-2 page-actions">
                <button
                    className="btn btn-outline-primary mx-3 px-3"
                    disabled={isValidatingAudio}
                    onClick={() => setIndex(index + 1)}>
                    <span><i className="bi bi-skip-forward me-1"></i>Skip</span>
                </button>
                <button className="btn btn-outline-success me-2 px-3"
                    disabled={isValidatingAudio || isActionButtonDisabled || text.length === 0}
                    onClick={() => handleSubmitTranscription("accepted")}>
                    {isValidatingAudio ? <Spinner size="sm" /> :
                        <span><i className="bi bi-hand-thumbs-up me-1"></i>Accept</span>
                    }
                </button>
            </div> */}
        </section>
    );
}

export default TranscriptionValidation;
