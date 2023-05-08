import './style.scss';
import TableView from '../../components/Table';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Modal } from 'bootstrap';
import {
    useUpdateTranscriptionsMutation,
} from '../../features/resources/resources-api-slice';
import { Spinner, useToast } from '@chakra-ui/react';
import TextOverflow from '../../components/TextOverflow';
import { BASE_API_URI } from '../../utils/constants';
import AudioPlayer from "../../components/AudioPlayer";
import PageMeta from '../../components/PageMeta';
import { useSelector } from 'react-redux';
import useAxios from '../../app/hooks/useAxios';


function TranscriptionsTable() {
    const [triggerReload, setTriggerReload] = useState(0);
    const loggedInUser = useSelector((state) => state.authentication.user);
    const { trigger: getEnumerators, data: enumeratorResponse, error: errorGettingEnumerators, isLoading: gettingEnumerators } = useAxios({ mainUrl: BASE_API_URI + '/get-enumerators/' })

    const [putTranscription, { isLoading: isPuttingTranscription, isSuccess: successPuttingTranscription, error: errorPuttingTranscription }] = useUpdateTranscriptionsMutation()

    const deletionModalRef = useRef(null);
    const editTranscriptionModalRef = useRef(null);
    const toast = useToast()

    const [selectedTranscription, setSelectedTranscription] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [editTranscriptionModal, setEditTranscriptionModal] = useState(null);
    const [newUpdate, setNewUpdate] = useState(null);
    const [isTranscriptionBuffering, setIsTranscriptionBuffering] = useState(true)

    // Form input
    const [correctedText, setCorrectedText] = useState('');
    const [transcriptionStatus, setTranscriptionStatus] = useState('accepted');
    const [enumerators, setEnumerators] = useState([])

    useEffect(() => {
        if (editTranscriptionModalRef.current !== null && editTranscriptionModal === null) {
            const modal = new Modal(editTranscriptionModalRef.current)
            setEditTranscriptionModal(modal)
        }
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }
    }, [])

    const showEditTranscriptionModal = (audio) => {
        setSelectedTranscription(audio)
        setCorrectedText("")
        setTranscriptionStatus("accepted")
        editTranscriptionModal?.show()
    }

    const handleSubmission = async () => {
        if (selectedTranscription === null) {
            return
        }
        const body = {
            text: correctedText,
            transcription_status: transcriptionStatus,
            id: selectedTranscription?.id || -1,
        }
        const response = await putTranscription(body).unwrap()
        if (response?.transcription !== undefined) {
            setNewUpdate({ item: response.transcription, action: "update" })
        }
        setTriggerReload((triggerReload) => triggerReload + 1);
    }

    useEffect(() => {
        if (errorPuttingTranscription) {
            toast({
                title: `Error: ${errorPuttingTranscription.status}`,
                description: "An error occurred while updating the transcription.",
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingTranscription])

    useEffect(() => {
        if (successPuttingTranscription) {
            toast({
                title: "Success",
                description: "Transcription updated successfully",
                position: "top-center",
                status: "success",
                duration: 2000,
                isClosable: true,
            })
            editTranscriptionModal?.hide()
        }
    }, [successPuttingTranscription])

    useEffect(() => {
        highlight(`text-0-container`, `text-1-container`)
    }, [selectedTranscription])

    // Getting enumerators
    useEffect(() => {
        getEnumerators()
    }, [])

    useEffect(() => {
        if (Boolean(enumeratorResponse?.enumerators)) {
            setEnumerators(enumeratorResponse.enumerators)
        }
    }, [enumeratorResponse])


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

    function needlemanWunsch(seq1, seq2) {
        const m = seq1.length;
        const n = seq2.length;
        let gap_penalty = -2;
        let match_score = 1;
        let mismatch_penalty = -1;

        // Initialize the scoring matrix
        const score = [];
        for (let i = 0; i <= m; i++) {
            score[i] = [];
            for (let j = 0; j <= n; j++) {
                score[i][j] = 0;
            }
        }

        // Initialize the first row and column of the scoring matrix
        for (let i = 1; i <= m; i++) {
            score[i][0] = score[i - 1][0] + gap_penalty;
        }
        for (let j = 1; j <= n; j++) {
            score[0][j] = score[0][j - 1] + gap_penalty;
        }

        // Fill in the rest of the scoring matrix
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                let diagScore = score[i - 1][j - 1] + (seq1[i - 1] == seq2[j - 1] ? match_score : mismatch_penalty);
                let leftScore = score[i][j - 1] + gap_penalty;
                let upScore = score[i - 1][j] + gap_penalty;

                score[i][j] = Math.max(diagScore, leftScore, upScore);
            }
        }

        // Traceback
        let align1 = "";
        let align2 = "";
        let i = m;
        let j = n;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && score[i][j] == score[i - 1][j - 1] + (seq1[i - 1] == seq2[j - 1] ? match_score : mismatch_penalty)) {
                align1 = seq1[i - 1] + align1;
                align2 = seq2[j - 1] + align2;
                i--;
                j--;
            } else if (j > 0 && score[i][j] == score[i][j - 1] + gap_penalty) {
                align1 = "-" + align1;
                align2 = seq2[j - 1] + align2;
                j--;
            } else {
                align1 = seq1[i - 1] + align1;
                align2 = "-" + align2;
                i--;
            }
        }

        return [align1, align2, score[m][n]];
    }


    return (
        <Fragment>
            <PageMeta title="Collected Transcriptions | Local Voice" />
            <div ref={editTranscriptionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedTranscription?.audio_url}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body row">
                            <div className="col-md-6 mx-auto">
                                <div className="d-flex justify-content-center align-items-center">
                                    <img src={selectedTranscription?.image_url} alt={selectedTranscription?.audio_url} style={{ maxHeight: "40vh" }} />
                                </div>
                            </div>

                            <div className="col-md-6 mx-auto">
                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Locale</b></label>
                                    <p className="text-justify">{selectedTranscription?.locale}</p>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="name" className="form-label"><b>Audio</b></label>
                                    <div className="d-flex justify-content-start align-items-center">
                                        <AudioPlayer
                                            canSeek={true}
                                            src={selectedTranscription?.audio_url}
                                            setIsAudioBuffering={setIsTranscriptionBuffering} />

                                        {selectedTranscription && isTranscriptionBuffering && <Spinner
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
                                    {selectedTranscription?.transcriptions?.map((transcription, index) => {
                                        const parent = <div className='mb-3' key={index}>
                                            <p className='text-primary d-flex align-items-center'><strong>Text {index + 1}</strong>
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
                                    <p htmlFor="name" className="mt-3"><b>Edit</b></p>
                                    <small className='text-muted'>Edit and save</small>
                                    <textarea className='form-control' rows="5" placeholder='Type here' value={correctedText} onChange={(e) => setCorrectedText(e.target.value)}></textarea>
                                </div>

                                <div className="my-3 d-flex justify-content-end">
                                    <div className='d-flex align-items-center' onChange={(e) => setTranscriptionStatus(e.target.value)}>
                                        <select name="transcriptionStatus" id="transcriptionStatus" className='form-select' defaultValue={transcriptionStatus}>
                                            <option value="accepted">Accepted</option>
                                            <option value="conflict">Conflict</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                    <button className="btn btn-primary btn-sm"
                                        disabled={isPuttingTranscription || (!Boolean(correctedText) && transcriptionStatus === "accepted")}
                                        onClick={handleSubmission}>{isPuttingTranscription && <Spinner />} Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mb-5 overflow-scroll">
                <TableView
                    reloadTrigger={triggerReload}
                    responseDataAttribute="audios"
                    dataSourceUrl={`${BASE_API_URI}/collected-transcriptions/`}
                    newUpdate={newUpdate}
                    filters={[
                        { key: "locale:ak_gh", value: "Akan", defaultValue: loggedInUser?.locale === "ak_gh" },
                        { key: "locale:dga_gh", value: "Dagbani", defaultValue: loggedInUser?.locale === "dga_gh" },
                        { key: "locale:dag_gh", value: "Dagaare", defaultValue: loggedInUser?.locale === "dag_gh" },
                        { key: "locale:ee_gh", value: "Ewe", defaultValue: loggedInUser?.locale === "ee_gh" },
                        { key: "locale:kpo_gh", value: "Ikposo", defaultValue: loggedInUser?.locale === "kpo_gh" },
                        { value: "---------------------" },
                        ...(enumerators?.map(enumerator => { return { key: `transcriptions__user_id:${enumerator.id}`, value: `${enumerator.fullname}` } }) || []).sort()
                    ]}
                    filters2={[{ key: "transcription_status:accepted", value: "Accepted" },
                    { key: "transcription_status:pending", value: "Pending" },
                    { key: "transcription_status:conflict", value: "Conflict" },
                    ]}
                    headers={[{
                        key: "audio_url", value: "Audio", render: (item) => {
                            return (
                                <div className="d-flex align-items-center">
                                    <TextOverflow text={item.audio_url} width={30} />
                                    {item.transcription_status === 'accepted' ?
                                        <span className='ms-2 p-0 badge bg-success'><i className="bi bi-info-circle"></i></span>
                                        :
                                        <span className='ms-2 p-0 badge bg-warning'><i className="bi bi-info-circle"></i></span>
                                    }
                                </div>
                            )
                        }
                    }, {
                        key: "transcriptions", value: "Transcriptions", render: (item) => {
                            return (
                                <div>
                                    {item.transcriptions?.map((transcription, index) => (
                                        <div>
                                            <span key={index} className={'badge bg-primary'}>{transcription.user.full_name} ({transcription.user.email_address})</span>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    }, {
                        key: "locale", value: "Locale"
                    },
                    {
                        key: "image_url", value: "Image", render: (item) => {
                            return (
                                <div>
                                    <img src={item.thumbnail} alt={item.thumbnail} className="profile-image" onClick={() => showEditTranscriptionModal(item)} />
                                </div>
                            )
                        }
                    }, {
                        value: "Actions", render: (item) => {
                            return (
                                <div className="d-flex">
                                    <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showEditTranscriptionModal(item)}>
                                        <i className="bi bi-list me-1"></i>
                                        More
                                    </button>
                                </div>
                            )
                        }
                    }]}
                >
                </TableView>
            </div>
        </Fragment >
    );
}

export default TranscriptionsTable;
