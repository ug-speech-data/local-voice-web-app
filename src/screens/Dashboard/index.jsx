import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import DashboardCard from "../../components/DashboardCard";
import { BASE_API_URI } from '../../utils/constants';
import { Fragment, useEffect, useState } from "react";
import useAxios from '../../app/hooks/useAxios';
import PageMeta from "../../components/PageMeta";


function Dashboard() {
    const { trigger: getDashboardStatics, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/dashboard-statistics/` });
    const [statistics, setStatistics] = useState(null)
    const [languageStatistics, setLanguageStatistics] = useState(null)
    const [languageStatisticsInHours, setLanguageStatisticsInHours] = useState(null)
    const [conflictResolutionLeaders, setConflictResolutionLeaders] = useState(null)
    const [validationLeaders, setValidationLeaders] = useState([])
    const [updatedAt, setUpdatedAt] = useState("")

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
                                    <p>Total Transcribed: </p>
                                    <p>{statistics?.audios_transcribed} ({statistics?.audios_hours_transcribed} hours)</p>
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
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <DashboardCard>
                                    <h6 className="h6 text-muted">CONFLICT RESOLUTION {conflictResolutionLeaders?.length >= 15 ? "(TOP 15)" : "(ALL)"}</h6>
                                    <table className="table">
                                        <thead>
                                            <tr style={{ verticalAlign: "middle" }}>
                                                <th>SURNAME</th>
                                                <th>OTHER NAMES</th>
                                                <th>CONFLICT RESOLVED</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {conflictResolutionLeaders?.map(leader => {
                                                return <tr>
                                                    <td>{leader.surname}</td>
                                                    <td>{leader.other_names}</td>
                                                    <td>{leader.conflicts_resolved}</td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </DashboardCard>
                            </div>

                            <div className="col-md-6">
                                <DashboardCard>
                                    <h6 className="h6 text-muted">VALIDATIONS {validationLeaders?.length >= 15 ? "(TOP 15)" : "(ALL)"}</h6>
                                    <table className="table">
                                        <thead>
                                            <tr style={{ verticalAlign: "middle" }}>
                                                <th>SURNAME</th>
                                                <th>OTHER NAMES</th>
                                                <th>VALIDATIONS RESOLVED</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {validationLeaders?.map(leader => {
                                                return <tr>
                                                    <td>{leader.surname}</td>
                                                    <td>{leader.other_names}</td>
                                                    <td>{leader.audios_validated}</td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </DashboardCard>
                            </div>
                        </div>

                        <DashboardCard className="col-md-12">
                            <span className="badge bg-primary">Updated At: {updatedAt}</span>
                            <table className="table">
                                <thead>
                                    <tr style={{ verticalAlign: "middle" }}>
                                        <th>LANGUAGE</th>
                                        <th>TOTAL SUBMITTED</th>
                                        <th>SINGLE VALIDATION</th>
                                        <th>DOUBLE VALIDATION</th>
                                        <th>VALIDATION CONFLICT</th>
                                        <th>TRANSCRIBED AUDIOS</th>
                                        <th>APPROVED</th>
                                        <th>% REJECTED</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Akan</b></td>
                                        <td>{languageStatistics.akan.akan_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_submitted_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.akan.akan_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_single_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.akan.akan_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_double_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.akan.akan_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.akan.akan_audios_akan_audios_transcribed} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_transcribed_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.akan.akan_audios_approved} Audios <br />[<b>{languageStatisticsInHours.akan.akan_audios_approved_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.akan.akan_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.akan.akan_audios_rejected_in_hours} hours</b>]</td>
                                    </tr>

                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Dagaare</b></td>
                                        <td>{languageStatistics.dagaare.dagaare_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_submitted_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagaare.dagaare_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_single_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagaare.dagaare_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_double_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagaare.dagaare_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagaare.dagaare_audios_dagaare_audios_transcribed} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_transcribed_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagaare.dagaare_audios_approved} Audios <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_approved_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagaare.dagaare_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.dagaare.dagaare_audios_rejected_in_hours} hours</b>]</td>
                                    </tr>

                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Dagbani</b></td>
                                        <td>{languageStatistics.dagbani.dagbani_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_submitted_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagbani.dagbani_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_single_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagbani.dagbani_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_double_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagbani.dagbani_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagbani.dagbani_audios_transcribed} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_transcribed_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagbani.dagbani_audios_approved} Audios <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_approved_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.dagbani.dagbani_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.dagbani.dagbani_audios_rejected_in_hours} hours</b>]</td>
                                    </tr>

                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Ewe</b></td>
                                        <td>{languageStatistics.ewe.ewe_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_submitted_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ewe.ewe_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_single_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ewe.ewe_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_double_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ewe.ewe_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ewe.ewe_audios_transcribed} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_transcribed_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ewe.ewe_audios_approved} Audios <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_approved_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ewe.ewe_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.ewe.ewe_audios_rejected_in_hours} hours</b>]</td>
                                    </tr>

                                    <tr style={{ height: "5em", verticalAlign: "middle" }}>
                                        <td><b>Ikposo</b></td>
                                        <td>{languageStatistics.ikposo.ikposo_audios_submitted} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_submitted_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ikposo.ikposo_audios_single_validation} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_single_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ikposo.ikposo_audios_double_validation} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_double_validation_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ikposo.ikposo_audios_validation_conflict} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_validation_conflict_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ikposo.ikposo_audios_ikposo_audios_transcribed} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_transcribed_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ikposo.ikposo_audios_approved} Audios <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_approved_in_hours} hours</b>]</td>
                                        <td>{languageStatistics.ikposo.ikposo_audios_rejected_percentage} % <br />[<b>{languageStatisticsInHours.ikposo.ikposo_audios_rejected_in_hours} hours</b>]</td>
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
