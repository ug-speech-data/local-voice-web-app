import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import DashboardCard from "../../components/DashboardCard";
import { BASE_API_URI } from '../../utils/constants';
import { Fragment, useEffect, useState } from "react";
import useAxios from '../../app/hooks/useAxios';
import PageMeta from "../../components/PageMeta";
import TabLayout from "../../components/TabLayout";
import { useSearchParams } from "react-router-dom";
import { useParams, useLocation } from 'react-router-dom'


function Dashboard() {
    const location = useLocation()
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 0);

    const { trigger: getDashboardStatics, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/dashboard-statistics/` });
    const [statistics, setStatistics] = useState(null)
    const [languageStatistics, setLanguageStatistics] = useState(null)
    const [languageStatisticsInHours, setLanguageStatisticsInHours] = useState(null)
    const [conflictResolutionLeaders, setConflictResolutionLeaders] = useState(null)
    const [validationLeaders, setValidationLeaders] = useState([])
    const [audiosByLeads, setAudiosByLeads] = useState([])


    const [updatedAt, setUpdatedAt] = useState("")

    useEffect(() => {
        const tab = searchParams.get('tab');
        setCurrentTab(tab || 0)
    }, [location, params])

    useEffect(() => {
        getDashboardStatics()
    }, [])

    useEffect(() => {
        if (Boolean(responseData?.statistics)) {
            setStatistics(responseData.statistics)
        }

        if (Boolean(responseData?.conflict_resolution_leaders)) {
            setConflictResolutionLeaders(responseData.conflict_resolution_leaders)
        }

        if (Boolean(responseData?.validation_leaders)) {
            setValidationLeaders(responseData.validation_leaders)
        }

        if (Boolean(responseData?.language_statistics)) {
            setLanguageStatistics(responseData.language_statistics)
        }

        if (Boolean(responseData?.language_statistics_in_hours)) {
            setLanguageStatisticsInHours(responseData.language_statistics_in_hours)
        }

        if (Boolean(responseData?.audios_by_leads)) {
            setAudiosByLeads(responseData.audios_by_leads)
        }

        if (Boolean(responseData?.updated_at)) {
            setUpdatedAt(responseData.updated_at)
        }
    }, [responseData, isLoading])

    return (
        <Fragment>
            <PageMeta title="Dashboard | Speech Data UG" />
            <TopNav />
            <div className="p-2">
                <div className="mx-auto d-flex flex-wrap col-lg-10">
                    <h4 className="h4">DATA SUMMARY</h4>
                </div>
                {Boolean(statistics) ?
                    <div className="mx-auto col-lg-10 row">
                        <div className="col-md-6">
                            <DashboardCard>
                                <h5 className="h5">AUDIOS</h5>
                                <div className="d-flex justify-content-between my-3">
                                    <p>Total Submitted: </p>
                                    <p>{statistics?.audios_submitted} ({statistics?.audios_hours_submitted} hours)</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between my-3">
                                    <p>Total Approved: </p>
                                    <p>{statistics?.audios_approved} ({statistics?.audios_hours_approved} hours)</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between my-3">
                                    <p>Total Transcription: </p>
                                    <p>{statistics?.audios_transcribed} ({statistics?.audios_hours_transcribed} hours)</p>
                                </div>
                                <div className="d-flex justify-content-between my-3">
                                    <p>Total Unique Transcription: </p>
                                    <p>{statistics?.audios_transcribed_unique} ({statistics?.audios_hours_transcribed_unique} hours)</p>
                                </div>
                            </DashboardCard>
                        </div>

                        <div className="col-md-6">
                            <DashboardCard>
                                <h5 className="h5">IMAGES</h5>
                                <div className="d-flex justify-content-between my-3">
                                    <p>Total Submitted: </p>
                                    <p>{statistics?.images_submitted}</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between my-4">
                                    <p>Total Approved: </p>
                                    <p>{statistics?.images_approved}</p>
                                </div>
                                <div className="d-flex justify-content-between my-3">
                                    <br />
                                </div>
                            </DashboardCard>
                        </div>

                        <h4 className="h4 mt-4">LEADER BOARDS</h4>

                        <TabLayout tabs={["AUDIOS BY LEADS", "CONFLICT RESOLUTION", "VALIDATIONS"]} currentTab={currentTab}>
                            <div className="col-md-6" style={{ "height": "80vh", "overflow": "auto" }}>
                                <DashboardCard>
                                    <h6 className="h6 text-muted">AUDIOS BY LEADS {"(ALL)"}</h6>
                                    <p className="text-muted">Total number of audios (in hours) recorded by all the enumerators per each lead.</p>
                                    <table className="table">
                                        <thead>
                                            <tr style={{ verticalAlign: "middle" }}>
                                                <th>S/N</th>
                                                <th>SURNAME</th>
                                                <th>OTHER NAMES</th>
                                                <th>LANG</th>
                                                <th style={{ verticalAlign: "middle", "textAlign": "center" }}>AUDIOS CONTRIBUTED <br />(EXP. 250)</th>
                                                <th style={{ verticalAlign: "middle", "textAlign": "center" }}>APPROVED <br />(EXP. 250)</th>
                                                <th style={{ verticalAlign: "middle", "textAlign": "center" }}>REJECTED</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {audiosByLeads?.map((leader, index) => {
                                                return <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{leader.surname}</td>
                                                    <td>{leader.other_names}</td>
                                                    <td>{leader.language}</td>
                                                    <td> <p style={{ verticalAlign: "middle", "textAlign": "center" }}>{leader.proxy_audios_submitted_in_hours}</p></td>
                                                    <td> <p style={{ verticalAlign: "middle", "textAlign": "center" }}>{leader.proxy_audios_accepted_in_hours}</p></td>
                                                    <td> <p style={{ verticalAlign: "middle", "textAlign": "center" }}>{leader.proxy_audios_rejected_in_hours}</p></td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </DashboardCard>
                            </div>
                            <div className="col-md-6" style={{ "height": "80vh", "overflow": "auto" }}>
                                <DashboardCard>
                                    <h6 className="h6 text-muted">CONFLICT RESOLUTION {conflictResolutionLeaders?.length >= 15 ? "(TOP 15)" : "(ALL)"}</h6>
                                    <table className="table">
                                        <thead>
                                            <tr style={{ verticalAlign: "middle" }}>
                                                <th>S/N</th>
                                                <th>SURNAME</th>
                                                <th>OTHER NAMES</th>
                                                <th>LANG</th>
                                                <th>RES.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {conflictResolutionLeaders?.map((leader, index) => {
                                                return <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{leader.surname}</td>
                                                    <td>{leader.other_names}</td>
                                                    <td>{leader.language}</td>
                                                    <td>{leader.conflicts_resolved}</td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </DashboardCard>
                            </div>

                            <div className="col-md-6" style={{ "height": "80vh", "overflow": "auto" }}>
                                <DashboardCard>
                                    <h6 className="h6 text-muted">VALIDATIONS {validationLeaders?.length >= 15 ? "(TOP 15)" : "(ALL)"}</h6>
                                    <table className="table">
                                        <thead>
                                            <tr style={{ verticalAlign: "middle" }}>
                                                <th>S/N</th>
                                                <th>SURNAME</th>
                                                <th>OTHER NAMES</th>
                                                <th>LANG</th>
                                                <th>VAL.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {validationLeaders?.map((leader, index) => {
                                                return <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{leader.surname}</td>
                                                    <td>{leader.other_names}</td>
                                                    <td>{leader.language}</td>
                                                    <td>{leader.audios_validated}</td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </DashboardCard>
                            </div>
                        </TabLayout>

                        <h4 className="h4 mt-4">PER LANGUAGE STATS</h4>
                        <DashboardCard className="col-md-12">
                            <span className="badge bg-primary">Updated At: {updatedAt}</span>
                            <table className="table">
                                <thead>
                                    <tr style={{ verticalAlign: "middle" }}>
                                        <th style={{textAlign:"center"}}>LANGUAGE</th>
                                        <th style={{textAlign:"center"}}>TOTAL SUBMITTED</th>
                                        <th style={{textAlign:"center"}}>SINGLE VALIDATION</th>
                                        <th style={{textAlign:"center"}}>DOUBLE VALIDATION</th>
                                        <th style={{textAlign:"center"}}>VALIDATION CONFLICT</th>
                                        <th style={{textAlign:"center"}}>ALL AUDIO TRANS.</th>
                                        <th style={{textAlign:"center"}}>UNIQUE AUDIO TRANS.</th>
                                        <th style={{textAlign:"center"}}>APPROVED</th>
                                        <th style={{textAlign:"center"}}>% REJECTED</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Akan</b></td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.akan.akan_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_submitted_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.akan.akan_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_single_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.akan.akan_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_double_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.akan.akan_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.akan.akan_audios_transcribed} Transcriptions <br />[<b>{languageStatisticsInHours.akan.akan_audios_transcribed_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.akan.akan_audios_transcribed_unique} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_transcribed_in_hours_unique} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.akan.akan_audios_approved} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_approved_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.akan.akan_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.akan.akan_audios_rejected_in_hours} hours</b>]</td>
                                    </tr>

                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Dagaare</b></td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagaare.dagaare_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_submitted_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagaare.dagaare_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_single_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagaare.dagaare_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_double_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagaare.dagaare_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagaare.dagaare_audios_transcribed} Transcriptions <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_transcribed_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagaare.dagaare_audios_transcribed_unique} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_transcribed_in_hours_unique} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagaare.dagaare_audios_approved} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_approved_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagaare.dagaare_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_rejected_in_hours} hours</b>]</td>
                                    </tr>

                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Dagbani</b></td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagbani.dagbani_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_submitted_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagbani.dagbani_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_single_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagbani.dagbani_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_double_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagbani.dagbani_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagbani.dagbani_audios_transcribed} Transcriptions <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_transcribed_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagbani.dagbani_audios_transcribed_unique} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_transcribed_in_hours_unique} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagbani.dagbani_audios_approved} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_approved_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.dagbani.dagbani_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_rejected_in_hours} hours</b>]</td>
                                    </tr>

                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Ewe</b></td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ewe.ewe_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_submitted_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ewe.ewe_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_single_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ewe.ewe_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_double_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ewe.ewe_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ewe.ewe_audios_transcribed} Transcriptions <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_transcribed_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ewe.ewe_audios_transcribed_unique} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_transcribed_in_hour_unique} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ewe.ewe_audios_approved} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_approved_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ewe.ewe_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_rejected_in_hours} hours</b>]</td>
                                    </tr>

                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Ikposo</b></td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ikposo.ikposo_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_submitted_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ikposo.ikposo_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_single_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ikposo.ikposo_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_double_validation_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ikposo.ikposo_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ikposo.ikposo_audios_transcribed} Transcriptions <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_transcribed_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ikposo.ikposo_audios_transcribed_unique} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_transcribed_in_hours_unique} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ikposo.ikposo_audios_approved} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_approved_in_hours} hours</b>]</td>
                                        <td style={{textAlign:"center"}}>{languageStatistics.ikposo.ikposo_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_rejected_in_hours} hours</b>]</td>
                                    </tr>
                                </tbody>
                            </table>

                        </DashboardCard>

                    </div>
                    : ""}
            </div>
            <Footer />
        </Fragment>
    );
}

export default Dashboard;
