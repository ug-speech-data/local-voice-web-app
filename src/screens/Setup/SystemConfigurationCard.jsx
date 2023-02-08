import './style.scss';
import {
    usePutConfigurationsMutation,
    useLazyGetGroupsQuery,
} from '../../features/resources/resources-api-slice';
import { Fragment, useState, useEffect } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { setConfigurations } from '../../features/global/global-slice';
import { useDispatch } from 'react-redux';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';
import SelectInput from '../../components/SelectInput';

function SystemConfigurationCard() {
    const [getGroups, { data: groupsResponse = [], isFetching, error }] = useLazyGetGroupsQuery()
    const configurations = useSelector((state) => state.global.configurations);
    const dispatch = useDispatch();
    const [putConfigurations, { isLoading: isPuttingGroup, isSuccess: successPuttingConfigurations, error: errorPuttingConfigurations }] = usePutConfigurationsMutation()
    const toast = useToast()

    // Form input
    const [maxBackgroundNoiseLevel, setMaxBackgroundNoiseLevel] = useState(0);
    const [maxCategoryForImage, setMaxCategoryForImage] = useState(0);
    const [requiredImageValidationCount, setRequiredImageValidationCount] = useState(0);
    const [requiredAudioValidationCount, setRequiredAudioValidationCount] = useState(0);
    const [requiredImageDescriptionCount, setRequiredImageDescriptionCount] = useState(0);
    const [requiredTranscriptionValidationCount, setRequiredTranscriptionValidationCount] = useState(0);
    const [numberOfBatches, setNumberOfBatches] = useState(0);
    const [amountPerAudio, setAmountPerAudio] = useState(0);
    const [amountPerAudioValidation, setAmountPerAudioValidation] = useState(0)
    const [audioAggregatorsAmountPerAudio, setAudioAggregatorsAmountPerAudio] = useState(0)
    const [individualAudioAggregatorsAmountPerAudio, setIndividualAudioAggregatorsAmountPerAudio] = useState(0)
    const [groups, setGroups] = useState([])
    const [enumeratorsGroup, setEnumeratorsGroup] = useState(null)
    const [validatorsGroup, setValidatorsGroup] = useState(null)
    const [demoVideo, setDemoVideo] = useState("")
    const [androidAPK, setAndroidAPK] = useState("")
    const [participantPrivacyStatement, setParticipantPrivacyStatement] = useState("")

    const { trigger: reshuffleImageIntoBatches, data: shufflingResponseData, error: errorReshuffling, isLoading: isReshuffling } = useAxios({ mainUrl: `${BASE_API_URI}/reshuffle-images/`, method: "POST" })
    const { trigger: assignImageBatch, data: assignmentResponse, error: errorAssigning, isLoading: isAssigning } = useAxios({ mainUrl: `${BASE_API_URI}/assign-images-batch-to-user/`, method: "POST" })


    useEffect(() => {
        if (shufflingResponseData) {
            toast({
                position: 'top-center',
                title: shufflingResponseData.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [shufflingResponseData])


    useEffect(() => {
        if (errorAssigning) {
            toast({
                position: 'top-center',
                title: errorAssigning,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorAssigning])

    useEffect(() => {
        if (assignmentResponse) {
            toast({
                position: 'top-center',
                title: assignmentResponse.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [assignmentResponse])



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

    useEffect(() => {
        getGroups()
    }, [])

    useEffect(() => {
        if (groupsResponse.groups) {
            setGroups(groupsResponse.groups)
        }
    }, [groupsResponse])


    const handleSave = async () => {
        const formData = new FormData();
        formData.append("max_background_noise_level", maxBackgroundNoiseLevel);
        formData.append("max_category_for_image", maxCategoryForImage);
        formData.append("required_image_validation_count", requiredImageValidationCount);
        formData.append("required_image_description_count", requiredImageDescriptionCount);
        formData.append("required_audio_validation_count", requiredAudioValidationCount);
        formData.append("required_transcription_validation_count", requiredTranscriptionValidationCount);
        formData.append("number_of_batches", numberOfBatches);
        formData.append("enumerators_group_name", enumeratorsGroup);
        formData.append("validators_group_name", validatorsGroup);
        formData.append("demo_video", demoVideo);
        formData.append("android_apk", androidAPK);
        formData.append("participant_amount_per_audio", amountPerAudio);
        formData.append("amount_per_audio_validation", amountPerAudioValidation);
        formData.append("audio_aggregators_amount_per_audio", audioAggregatorsAmountPerAudio);
        formData.append("individual_audio_aggregators_amount_per_audio", individualAudioAggregatorsAmountPerAudio);
        formData.append("participant_privacy_statement", participantPrivacyStatement);

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
            setEnumeratorsGroup(configurations?.enumerators_group?.name || "");
            setValidatorsGroup(configurations?.validators_group?.name || "");
            setAmountPerAudio(configurations?.participant_amount_per_audio || 0);
            setAmountPerAudioValidation(configurations?.amount_per_audio_validation || 0);
            setAudioAggregatorsAmountPerAudio(configurations?.audio_aggregators_amount_per_audio || 0);
            setIndividualAudioAggregatorsAmountPerAudio(configurations?.individual_audio_aggregators_amount_per_audio || 0);
            setParticipantPrivacyStatement(configurations?.participant_privacy_statement || "");
        }
    }, [configurations])

    return (
        <Fragment>
            <div className="card">
                <div className="card-header d-flex justify-content-between" style={{ "position": "sticky", "top": "-1em", "zIndex": "1", "background": "white" }}>
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
                <div className="card-body overflow-scroll" style={{ background: "rgb(240,240,240)" }}>
                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Maximum Category for Image</b></p>
                        <small>What is the maximum number of categories an image can belong to?</small>
                        <input
                            className="form-control"
                            value={maxCategoryForImage}
                            onChange={(e) => setMaxCategoryForImage(e.target.value)}
                            type="number" min={1} max={10} />
                    </div>
                    <div className="form-group my-3 py-4 px-2 bg-white">
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
                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Accepted Background Noise Level</b></p>
                        <small>Accepted minimum amplitude of background noise before recording start.</small>
                        <input className="form-control"
                            value={maxBackgroundNoiseLevel}
                            type="number"
                            onChange={(e) => setMaxBackgroundNoiseLevel(e.target.value)}
                            min={0} max={1000} step={1} />
                    </div>
                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Image Validation Count</b></p>
                        <small>Required number of validation for each image.</small>
                        <input className="form-control"
                            value={requiredImageValidationCount}
                            type="number"
                            onChange={(e) => setRequiredImageValidationCount(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>
                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Image Description Count</b></p>
                        <small>Required number of description for each image.</small>
                        <input className="form-control"
                            value={requiredImageDescriptionCount}
                            type="number"
                            onChange={(e) => setRequiredImageDescriptionCount(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>
                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Audio Validation Count</b></p>
                        <small>Required number of validation for each audio file.</small>
                        <input className="form-control"
                            value={requiredAudioValidationCount}
                            type="number"
                            onChange={(e) => setRequiredAudioValidationCount(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Transcription Validation Count</b></p>
                        <small>Required number of validation for each transcription.</small>
                        <input className="form-control"
                            value={requiredTranscriptionValidationCount}
                            type="number"
                            onChange={(e) => setRequiredTranscriptionValidationCount(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Number of batches</b></p>
                        <small>Number of batches into which to put images for enumerators.
                            <button className="btn btn-sm btn-outline-primary"
                                disabled={isReshuffling || ((configurations?.number_of_batches || "") !== numberOfBatches)}
                                onClick={(e) => reshuffleImageIntoBatches()}>
                                {isReshuffling && <Spinner size="sm" />}
                                Reshuffle
                            </button>
                        </small>
                        {((configurations?.number_of_batches || "") !== numberOfBatches) && <p className="mx-2 text-danger">Save *</p>}
                        <input className="form-control"
                            value={numberOfBatches}
                            type="number"
                            onChange={(e) => setNumberOfBatches(e.target.value)}
                            min={1} max={100} step={1} />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Enumerators Group</b></p>
                        <small>
                            The group/role for enumerators. All users in this group will be assigned a batch of images.
                            <button className="btn btn-sm btn-outline-primary"
                                disabled={isAssigning || !Boolean(configurations?.enumerators_group) || ((configurations?.enumerators_group?.name || "") !== enumeratorsGroup)}
                                onClick={(e) => assignImageBatch()}>
                                {isAssigning && <Spinner size="sm" />}
                                Assign Batches
                            </button>
                            {((configurations?.enumerators_group?.name || "") !== enumeratorsGroup) && <span className="mx-2 text-danger">Save *</span>}
                        </small>
                        <SelectInput
                            onChange={(e) => setEnumeratorsGroup(e.target.value)}
                            value={enumeratorsGroup}
                            options={groups.map((group) => ({ value: group.name, label: group.name }))}
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Validators Group</b></p>
                        <small>
                            The group/role for validators. All users in this group will be assigned a batch of audios to validate.
                        </small>
                        {((configurations?.validators_group?.name || "") !== validatorsGroup) && <p className="mx-2 text-danger">Save *</p>}
                        <SelectInput
                            onChange={(e) => setValidatorsGroup(e.target.value)}
                            value={validatorsGroup}
                            options={groups.map((group) => ({ value: group.name, label: group.name }))}
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Android APK</b></p>
                        <small>The APK File to be downloaded.</small>
                        {configurations?.android_apk
                            && <p><a className='badge bg-primary' href={configurations.android_apk}>Currently: {configurations.android_apk}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setAndroidAPK(e.target.files[0])}
                            type="file"
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Participant Privacy Statement</b></p>
                        <small>Privacy statement to be accepted by participants when recording audio.</small>
                        {((configurations?.participant_privacy_statement || "") !== participantPrivacyStatement) && <p className="mx-2 text-danger">Save *</p>}
                        <textarea className="form-control"
                            value={participantPrivacyStatement}
                            onChange={(e) => setParticipantPrivacyStatement(e.target.value)} />
                    </div>

                    <h4 className="h4 mt-3">Compensation</h4>
                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Participant Amount Per Audio</b></p>
                        <small>An amount of money that a participant has to be paid per audio file.</small>
                        {((configurations?.participant_amount_per_audio || "") !== amountPerAudio) && <p className="mx-2 text-danger">Save *</p>}
                        <input className="form-control"
                            value={amountPerAudio}
                            type="number"
                            min={0}
                            step={0.01}
                            onChange={(e) => setAmountPerAudio(e.target.value)} />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Amount Per Audio Validation</b></p>
                        <small>An amount of money that a validator has to be paid per audio file.</small>
                        {((configurations?.amount_per_audio_validation || "") !== amountPerAudioValidation) && <p className="mx-2 text-danger">Save *</p>}
                        <input className="form-control"
                            value={amountPerAudioValidation}
                            type="number"
                            min={0}
                            step={0.01}
                            onChange={(e) => setAmountPerAudioValidation(e.target.value)} />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Aggregators Amount Per Audio</b></p>
                        <small>An amount of money that an aggregator has to be paid per audio file.</small>
                        {((configurations?.audio_aggregators_amount_per_audio || "") !== audioAggregatorsAmountPerAudio) && <p className="mx-2 text-danger">Save *</p>}
                        <input className="form-control"
                            value={audioAggregatorsAmountPerAudio}
                            type="number"
                            min={0}
                            step={0.01}
                            onChange={(e) => setAudioAggregatorsAmountPerAudio(e.target.value)} />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Individual Audio Aggregators Amount Per Audio</b></p>
                        <small>An amount of money that an individual aggregator has to be paid per audio file.</small>
                        {((configurations?.individual_audio_aggregators_amount_per_audio || "") !== individualAudioAggregatorsAmountPerAudio) && <p className="mx-2 text-danger">Save *</p>}
                        <input className="form-control"
                            value={individualAudioAggregatorsAmountPerAudio}
                            type="number"
                            min={0}
                            step={0.01}
                            onChange={(e) => setIndividualAudioAggregatorsAmountPerAudio(e.target.value)} />
                    </div>

                </div>
            </div>
        </Fragment >
    );
}

export default SystemConfigurationCard;
