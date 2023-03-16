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

    const [allowSavingLessThanRequiredPerParticipant, setAllowSavingLessThanRequiredPerParticipant] = useState(false)
    const [allowToRecordMoreThanRequiredPerParticipant, setAllowToRecordMoreThanRequiredPerParticipant] = useState(false)
    const [numberofAudiosPerParticipant, setNumberofAudiosPerParticipant] = useState(0)

    const [androidAPK, setAndroidAPK] = useState("")
    const [participantPrivacyStatement, setParticipantPrivacyStatement] = useState("")
    const [maxImageForValidationPerUser, setMaxImageForValidationPerUser] = useState(0)
    const [maxAudioValidationPerUser, setMaxAudioValidationPerUser] = useState(0)

    // Audios
    const [participantPrivacyStatementAudioEwe, setParticipantPrivacyStatementAudioEwe] = useState("")
    const [participantPrivacyStatementAudioAkan, setParticipantPrivacyStatementAudioAkan] = useState("")
    const [participantPrivacyStatementAudioDagaare, setParticipantPrivacyStatementAudioDagaare] = useState("")
    const [participantPrivacyStatementAudioIkposo, setParticipantPrivacyStatementAudioIkposo] = useState("")
    const [participantPrivacyStatementAudioDagbani, setParticipantPrivacyStatementAudioDagbani] = useState("")

    // Demo Video
    const [demoVideoEwe, setDemoVideoEwe] = useState("")
    const [demoVideoAkan, setDemoVideoAkan] = useState("")
    const [demoVideoDagaare, setDemoVideoDagaare] = useState("")
    const [demoVideoIkposo, setDemoVideoIkposo] = useState("")
    const [demoVideoDagbani, setDemoVideoDagbani] = useState("")

    const { trigger: reshuffleAllImageIntoBatches, data: shufflingResponseData, error: errorReshuffling, isLoading: isReshuffling } = useAxios({ mainUrl: `${BASE_API_URI}/reshuffle-images/`, method: "POST" })
    const { trigger: reshuffleSelectedImageIntoBatches, data: shufflingSelectResponseData, error: errorReshufflingSelected, isLoading: isReshufflingSelected } = useAxios({ mainUrl: `${BASE_API_URI}/reshuffle-images/?is_accepted=1`, method: "POST" })
    const { trigger: assignImageBatch, data: assignmentResponse, error: errorAssigning, isLoading: isAssigning } = useAxios({ mainUrl: `${BASE_API_URI}/assign-images-batch-to-user/`, method: "POST" })

    // Shuffling
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

    // Shuffling selected
    useEffect(() => {
        if (shufflingSelectResponseData) {
            toast({
                position: 'top-center',
                title: shufflingSelectResponseData.message,
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [shufflingSelectResponseData])


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
        if (errorReshufflingSelected) {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: errorReshufflingSelected,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorReshufflingSelected])

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
        formData.append("android_apk", androidAPK);
        formData.append("participant_amount_per_audio", amountPerAudio);
        formData.append("amount_per_audio_validation", amountPerAudioValidation);
        formData.append("audio_aggregators_amount_per_audio", audioAggregatorsAmountPerAudio);
        formData.append("individual_audio_aggregators_amount_per_audio", individualAudioAggregatorsAmountPerAudio);
        formData.append("participant_privacy_statement", participantPrivacyStatement);
        formData.append("max_image_for_validation_per_user", maxImageForValidationPerUser);
        formData.append("max_audio_validation_per_user", maxAudioValidationPerUser);

        // Audios
        formData.append("participant_privacy_statement_audio_ewe", participantPrivacyStatementAudioEwe);
        formData.append("participant_privacy_statement_audio_akan", participantPrivacyStatementAudioAkan);
        formData.append("participant_privacy_statement_audio_dagaare", participantPrivacyStatementAudioDagaare);
        formData.append("participant_privacy_statement_audio_ikposo", participantPrivacyStatementAudioIkposo);
        formData.append("participant_privacy_statement_audio_dagbani", participantPrivacyStatementAudioDagbani);

        formData.append("allow_saving_less_than_required_per_participant", allowSavingLessThanRequiredPerParticipant);
        formData.append("allow_recording_more_than_required_per_participant", allowToRecordMoreThanRequiredPerParticipant);
        formData.append("number_of_audios_per_participant", numberofAudiosPerParticipant);

        // Demo video
        formData.append("demo_video_ewe", demoVideoEwe);
        formData.append("demo_video_akan", demoVideoAkan);
        formData.append("demo_video_dagaare", demoVideoDagaare);
        formData.append("demo_video_ikposo", demoVideoIkposo);
        formData.append("demo_video_dagbani", demoVideoDagbani);

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
            setMaxImageForValidationPerUser(configurations?.max_image_for_validation_per_user || 0)
            setAllowToRecordMoreThanRequiredPerParticipant(configurations?.allow_recording_more_than_required_per_participant || false)
            setAllowSavingLessThanRequiredPerParticipant(configurations?.allow_saving_less_than_required_per_participant || false)
            setNumberofAudiosPerParticipant(configurations?.number_of_audios_per_participant || 0)
            setMaxAudioValidationPerUser(configurations?.max_audio_validation_per_user || 0)
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
                        <p><b>Maximum Image Validation Per User</b></p>
                        <small>The maximum number of images a user can validate.</small>
                        <input
                            className="form-control"
                            value={maxImageForValidationPerUser}
                            onChange={(e) => setMaxImageForValidationPerUser(e.target.value)}
                            type="number" min={1} />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Maximum Audioi Validation Per User</b></p>
                        <small>The maximum number of audios a user can validate.</small>
                        <input
                            className="form-control"
                            value={maxAudioValidationPerUser}
                            onChange={(e) => setMaxAudioValidationPerUser(e.target.value)}
                            type="number" min={1} />
                    </div>

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
                        <p><b>Number of recodings per participant</b></p>
                        <small>Number of audios description each participant is required to do.</small>
                        <input className="form-control"
                            value={numberofAudiosPerParticipant}
                            type="number"
                            onChange={(e) => setNumberofAudiosPerParticipant(e.target.value)}
                            min={1} max={10000} step={1} />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Allow Saving Less than Required</b></p>
                        <small>Allow participant to save recordings less than 120 per participant.</small>
                        <br />
                        <input className="form-check-input"
                            checked={allowSavingLessThanRequiredPerParticipant}
                            type="checkbox"
                            onChange={(e) => setAllowSavingLessThanRequiredPerParticipant(e.target.checked)} />
                    </div>
                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Allow Recording More than {numberofAudiosPerParticipant}</b></p>
                        <small>Allow participant to record more than {numberofAudiosPerParticipant} audio descriptions.</small>
                        <br />
                        <input className="form-check-input"
                            checked={allowToRecordMoreThanRequiredPerParticipant}
                            type="checkbox"
                            onChange={(e) => setAllowToRecordMoreThanRequiredPerParticipant(e.target.checked)} />
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
                        <small>Number of batches into which to put images for enumerators.</small>
                        <p className='my-2'>
                            <button className="btn btn-sm btn-outline-primary me-2"
                                disabled={isReshuffling || isReshufflingSelected || ((configurations?.number_of_batches || "") !== numberOfBatches)}
                                onClick={(e) => reshuffleAllImageIntoBatches()}>
                                {isReshuffling && <Spinner size="sm" />}
                                Reshuffle All Images
                            </button>

                            <button className="btn btn-sm btn-outline-primary"
                                disabled={isReshuffling || isReshufflingSelected || ((configurations?.number_of_batches || "") !== numberOfBatches)}
                                onClick={(e) => reshuffleSelectedImageIntoBatches()}>
                                {isReshuffling && <Spinner size="sm" />}
                                Reshuffle Selected Images
                            </button>
                        </p>
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

                    <h4 className="h4 mt-3">Privacy Statement Audios</h4>
                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Ewe</b></p>
                        <small>Privacy Statment for recording in Ewe</small>
                        {configurations?.participant_privacy_statement_audio_ewe
                            && <p><a className='badge bg-primary' href={configurations.participant_privacy_statement_audio_ewe}>Currently: {configurations.participant_privacy_statement_audio_ewe}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setParticipantPrivacyStatementAudioEwe(e.target.files[0])}
                            type="file"
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Akan</b></p>
                        <small>Privacy Statment for recording in Akan</small>
                        {configurations?.participant_privacy_statement_audio_akan
                            && <p><a className='badge bg-primary' href={configurations.participant_privacy_statement_audio_akan}>Currently: {configurations.participant_privacy_statement_audio_akan}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setParticipantPrivacyStatementAudioAkan(e.target.files[0])}
                            type="file"
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Dagaare</b></p>
                        <small>Privacy Statment for recording in Dagaare</small>
                        {configurations?.participant_privacy_statement_audio_dagaare
                            && <p><a className='badge bg-primary' href={configurations.participant_privacy_statement_audio_dagaare}>Currently: {configurations.participant_privacy_statement_audio_dagaare}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setParticipantPrivacyStatementAudioDagaare(e.target.files[0])}
                            type="file"
                        />
                    </div>


                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Ikposo</b></p>
                        <small>Privacy Statment for recording in Ikposo</small>
                        {configurations?.participant_privacy_statement_audio_ewe
                            && <p><a className='badge bg-primary' href={configurations.participant_privacy_statement_audio_ewe}>Currently: {configurations.participant_privacy_statement_audio_ewe}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setParticipantPrivacyStatementAudioIkposo(e.target.files[0])}
                            type="file"
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Dagbani</b></p>
                        <small>Privacy Statment for recording in Dagbani</small>
                        {configurations?.participant_privacy_statement_audio_dagbani
                            && <p><a className='badge bg-primary' href={configurations.participant_privacy_statement_audio_dagbani}>Currently: {configurations.participant_privacy_statement_audio_dagbani}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setParticipantPrivacyStatementAudioDagbani(e.target.files[0])}
                            type="file"
                        />
                    </div>


                    <h4 className="h4 mt-3">Demo Videos</h4>
                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Ewe</b></p>
                        <small>Demo video in Ewe</small>
                        {configurations?.demo_video_ewe
                            && <p><a className='badge bg-primary' href={configurations.demo_video_ewe}>Currently: {configurations.demo_video_ewe}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setDemoVideoEwe(e.target.files[0])}
                            type="file"
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Akan</b></p>
                        <small>Demo video in Akan</small>
                        {configurations?.demo_video_akan
                            && <p><a className='badge bg-primary' href={configurations.demo_video_akan}>Currently: {configurations.demo_video_akan}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setDemoVideoAkan(e.target.files[0])}
                            type="file"
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Dagbani</b></p>
                        <small>Demo video in Dagbani</small>
                        {configurations?.demo_video_dagbani
                            && <p><a className='badge bg-primary' href={configurations.demo_video_dagbani}>Currently: {configurations.demo_video_dagbani}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setDemoVideoDagbani(e.target.files[0])}
                            type="file"
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Dagaare</b></p>
                        <small>Demo video in Dagaare</small>
                        {configurations?.demo_video_dagaare
                            && <p><a className='badge bg-primary' href={configurations.demo_video_dagaare}>Currently: {configurations.demo_video_dagaare}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setDemoVideoDagaare(e.target.files[0])}
                            type="file"
                        />
                    </div>

                    <div className="form-group my-3 py-4 px-2 bg-white">
                        <p><b>Ikposo</b></p>
                        <small>Demo video in Ikposo</small>
                        {configurations?.demo_video_ikposo
                            && <p><a className='badge bg-primary' href={configurations.demo_video_ikposo}>Currently: {configurations.demo_video_ikposo}</a></p>
                        }
                        <input className="form-control"
                            onChange={(e) => setDemoVideoIkposo(e.target.files[0])}
                            type="file"
                        />
                    </div>

                </div>
            </div>
        </Fragment >
    );
}

export default SystemConfigurationCard;
