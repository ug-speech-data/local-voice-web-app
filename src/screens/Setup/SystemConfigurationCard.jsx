import './style.scss';
import {
    usePutConfigurationsMutation,
} from '../../features/resources/resources-api-slice';
import { Fragment, useState, useEffect } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { setConfigurations } from '../../features/global/global-slice';
import { useDispatch } from 'react-redux';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';

function SystemConfigurationCard() {
    const configurations = useSelector((state) => state.global.configurations);
    const dispatch = useDispatch();
    const [putConfigurations, { isLoading: isPuttingGroup, isSuccess: successPuttingConfigurations, error: errorPuttingConfigurations }] = usePutConfigurationsMutation()

    // Form input
    const [maxBackgroundNoiseLevel, setMaxBackgroundNoiseLevel] = useState(0);
    const [maxCategoryForImage, setMaxCategoryForImage] = useState(0);
    const [requiredImageValidationCount, setRequiredImageValidationCount] = useState(0);
    const [requiredAudioValidationCount, setRequiredAudioValidationCount] = useState(0);
    const [requiredImageDescriptionCount, setRequiredImageDescriptionCount] = useState(0);
    const [requiredTranscriptionValidationCount, setRequiredTranscriptionValidationCount] = useState(0);
    const [numberOfBatches, setNumberOfBatches] = useState(0);

    const { trigger: reshuffleImageIntoBatches, data: shufflingResponseData, error: errorReshuffling, isLoading: isReshuffling } = useAxios(`${BASE_API_URI}/reshuffle-images/`, "POST")

    useEffect(() => {
        if (shufflingResponseData) {
            toast({
                position: 'top-center',
                title: shufflingResponseData.message,
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [shufflingResponseData])

    useEffect(() => {
        if (errorReshuffling) {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: errorReshuffling,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorReshuffling])


    const [demoVideo, setDemoVideo] = useState("")

    const toast = useToast()

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("max_background_noise_level", maxBackgroundNoiseLevel);
        formData.append("max_category_for_image", maxCategoryForImage);
        formData.append("required_image_validation_count", requiredImageValidationCount);
        formData.append("required_image_description_count", requiredImageDescriptionCount);
        formData.append("required_audio_validation_count", requiredAudioValidationCount);
        formData.append("required_transcription_validation_count", requiredTranscriptionValidationCount);
        formData.append("number_of_batches", numberOfBatches);
        formData.append("demo_video", demoVideo);

        const response = await putConfigurations(formData).unwrap()
        if (response?.configurations) {
            dispatch(setConfigurations(response.configurations))
        }
    }

    useEffect(() => {
        if (errorPuttingConfigurations) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorPuttingConfigurations.status}`,
                description: errorPuttingConfigurations.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingConfigurations])

    useEffect(() => {
        if (successPuttingConfigurations) {
            toast({
                position: 'top-center',
                title: `Configurations updated successfully`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [successPuttingConfigurations])

    useEffect(() => {
        if (configurations) {
            setMaxBackgroundNoiseLevel(configurations?.max_background_noise_level || 0);
            setMaxCategoryForImage(configurations?.max_category_for_image || 0);
            setRequiredImageValidationCount(configurations?.required_image_validation_count || 0);
            setRequiredImageDescriptionCount(configurations?.required_image_description_count || 0);
            setRequiredAudioValidationCount(configurations?.required_audio_validation_count || 0);
            setRequiredTranscriptionValidationCount(configurations?.required_transcription_validation_count || 0);
            setNumberOfBatches(configurations?.number_of_batches || 0);
        }
    }, [configurations])

    return (
        <Fragment>
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <h1>GLOBAL CONFIGURATIONS</h1>
                    <div className="d-flex card-options justify-content-end">
                        <button className="btn btn-primary btn-sm"
                            disabled={isPuttingGroup}
                            onClick={handleSave}
                        >
                            {isPuttingGroup && <Spinner size="sm" />}
                            Save
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="form-group my-3">
                        <p><b>Maximum Category for Image</b></p>
                        <small>What is the maximum number of categories an image can belong to?</small>
                        <input
                            className="form-control"
                            value={maxCategoryForImage}
                            onChange={(e) => setMaxCategoryForImage(e.target.value)}
                            type="number" min={1} max={10} />
                    </div>
                    <div className="form-group my-3">
                        <p><b>Demo Video</b></p>
                        <small>This video will be shown to users before recording starts.</small>
                        {configurations?.demo_video_url
                            && <p><a className='badge bg-primary' href={configurations.demo_video_url}>Currently: {configurations.demo_video_url}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setDemoVideo(e.target.files[0])}
                            type="file"
                        />
                    </div>
                    <div className="form-group my-3">
                        <p><b>Accepted Background Noise Level</b></p>
                        <small>Accepted minimum amplitude of background noise before recording start.</small>
                        <input className="form-control"
                            value={maxBackgroundNoiseLevel}
                            type="number"
                            onChange={(e) => setMaxBackgroundNoiseLevel(e.target.value)}
                            min={0} max={1000} step={1} />
                    </div>
                    <div className="form-group my-3">
                        <p><b>Image Validation Count</b></p>
                        <small>Required number of validation for each image.</small>
                        <input className="form-control"
                            value={requiredImageValidationCount}
                            type="number"
                            onChange={(e) => setRequiredImageValidationCount(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>
                    <div className="form-group my-3">
                        <p><b>Image Description Count</b></p>
                        <small>Required number of description for each image.</small>
                        <input className="form-control"
                            value={requiredImageDescriptionCount}
                            type="number"
                            onChange={(e) => setRequiredImageDescriptionCount(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>
                    <div className="form-group my-3">
                        <p><b>Audio Validation Count</b></p>
                        <small>Required number of validation for each audio file.</small>
                        <input className="form-control"
                            value={requiredAudioValidationCount}
                            type="number"
                            onChange={(e) => setRequiredAudioValidationCount(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>

                    <div className="form-group my-3">
                        <p><b>Transcription Validation Count</b></p>
                        <small>Required number of validation for each transcription.</small>
                        <input className="form-control"
                            value={requiredTranscriptionValidationCount}
                            type="number"
                            onChange={(e) => setRequiredTranscriptionValidationCount(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>


                    <div className="form-group my-3">
                        <p><b>Number of batches</b></p>
                        <small>Number of batches into which to put images for enumerators.
                            <button className="btn btn-sm btn-outline-primary"
                                disabled={isReshuffling}
                                onClick={(e) => reshuffleImageIntoBatches()}>
                                {isReshuffling && <Spinner size="sm" />}
                                Reshuffle
                            </button>
                        </small>
                        <input className="form-control"
                            value={numberOfBatches}
                            type="number"
                            onChange={(e) => setNumberOfBatches(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default SystemConfigurationCard;
