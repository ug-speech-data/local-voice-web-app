import './style.scss';
import AudioPlayer from "../../components/AudioPlayer";
import { useState } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import {
    useGetTranscriptionToValidateQuery,
    useValidateTranscriptionMutation,
} from '../../features/resources/resources-api-slice';

function TranscriptionValidation() {
    //HACK : offset is used to trigger a new request to the API
    const [offset, setOffset] = useState(-1);

    const { data: response = {}, isFetching: isFetchingTranscription, error: transcriptionFetchingError } = useGetTranscriptionToValidateQuery(offset);
    const [validateTranscription, { isLoading: isValidatingTranscription, error: transcriptionValidationError }] = useValidateTranscriptionMutation()
    const toast = useToast()
    const [isActionButtonDisabled, setIsActionButtonDisabled] = useState(true)
    const [isTranscriptionBuffering, setIsTranscriptionBuffering] = useState(true)

    let currentTranscription = response["transcription"]
    if (transcriptionFetchingError) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${transcriptionFetchingError.originalStatus}`,
            description: transcriptionFetchingError.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }

    const handleLoadNewTranscription = () => {
        // Loading transcription
        setIsTranscriptionBuffering(true)
        setIsActionButtonDisabled(true)
        setOffset(offset + 1)
    }

    const handleValidate = async (status) => {
        if (isValidatingTranscription) return

        const body = { id: currentTranscription?.id || -1, status }
        const response = await validateTranscription(body).unwrap()
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
        // Next transcription
        handleLoadNewTranscription()
    }

    if (transcriptionValidationError) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${transcriptionValidationError.originalStatus}`,
            description: transcriptionValidationError.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }

    const handleTranscriptionEnded = () => {
        setIsActionButtonDisabled(false)
    }

    return (
        <section className='image-validation'>
            {currentTranscription === undefined || currentTranscription === null ?
                <div className="my-5">
                    <p className='text-warning text-center'><b>No more audios to validate</b></p>
                    <p className='text-center my-3'><button className='btn btn-primary' onClick={() => setOffset(-1)}>
                        {isFetchingTranscription && <Spinner />}
                        Reload
                    </button></p>
                </div> : null
            }

            {currentTranscription &&
                <div className="my-5 d-flex justify-content-center position-relative">
                    <p>Please verify whether the text is a word-for-word transcription of the transcription..</p>
                </div>
            }

            {currentTranscription &&
                <div className="col-md-10 mx-auto transcription-box">
                    <p className="text-center">{currentTranscription.text}</p>
                </div>
            }

            {currentTranscription &&
                <div className='my-3 position-relative d-flex justify-content-center align-items-center'>
                    <AudioPlayer
                        src={currentTranscription.audio.audio_url}
                        onEnded={handleTranscriptionEnded}
                        setIsAudioBuffering={setIsTranscriptionBuffering} />

                    {(isTranscriptionBuffering | isFetchingTranscription) ? <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        size="xl"
                        color='purple.500'
                    /> : null}
                </div>
            }

            {currentTranscription &&
                <div className="d-flex justify-content-center my-5 p-2 page-actions">
                    <button
                        className="btn btn-outline-danger me-2 px-3"
                        disabled={isValidatingTranscription || isActionButtonDisabled}
                        onClick={() => handleValidate("rejected")}>
                        {isValidatingTranscription ? <Spinner size="sm" /> :
                            <span><i className="bi bi-hand-thumbs-down me-1"></i>Reject</span>
                        }
                    </button>
                    <button
                        className="btn btn-outline-primary mx-3 px-3"
                        disabled={isValidatingTranscription}
                        onClick={() => setOffset(currentTranscription?.id || -1)}>
                        <span><i className="bi bi-skip-forward me-1"></i>Skip</span>
                    </button>
                    <button className="btn btn-outline-success me-2 px-3"
                        disabled={isValidatingTranscription || isActionButtonDisabled}
                        onClick={() => handleValidate("accepted")}>
                        {isValidatingTranscription ? <Spinner size="sm" /> :
                            <span><i className="bi bi-hand-thumbs-up me-1"></i>Accept</span>
                        }
                    </button>
                </div>
            }
        </section>
    );
}

export default TranscriptionValidation;
