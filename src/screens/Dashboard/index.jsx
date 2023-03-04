import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import DashboardCard from "../../components/DashboardCard";
import { BASE_API_URI } from '../../utils/constants';
import { Fragment, useEffect, useState } from "react";
import useAxios from '../../app/hooks/useAxios';


function Dashboard() {
    const { trigger: getDashboardStatics, data: responseData, error, isLoading } = useAxios({ mainUrl: `${BASE_API_URI}/dashboard-statistics/` });
    const [statistics, setStatistics] = useState(null)

    useEffect(() => {
        getDashboardStatics()
    }, [getDashboardStatics])

    useEffect(() => {
        if (Boolean(responseData?.statistics)) {
            setStatistics(responseData.statistics)
        }
    }, [responseData, isLoading])

    return (
        <Fragment>
            <TopNav />
            <div className="p-2">
                <div className="mx-auto d-flex flex-wrap col-lg-8">
                    <h4>DATA SUMMARY</h4>
                </div>
                {Boolean(statistics) ?
                    <div className="mx-auto col-lg-8 row">
                        <div className="col-md-6">
                            <DashboardCard>
                                <h5 className="h5">AUDIOS</h5>
                                <div className="d-flex justify-content-between">
                                    <p>Total Submitted: </p>
                                    <p>{statistics?.audios_submitted} ({statistics?.audios_hours_submitted} hours)</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <p>Total Approved: </p>
                                    <p>{statistics?.audios_approved} ({statistics?.audios_hours_approved} hours)</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <p>Total Transcribed: </p>
                                    <p>{statistics?.audios_transcribed} ({statistics?.audios_hours_transcribed} hours)</p>
                                </div>
                                <hr />
                            </DashboardCard>
                        </div>

                        <div className="col-md-6">
                            <DashboardCard>
                                <h5 className="h5">IMAGES</h5>
                                <div className="d-flex justify-content-between">
                                    <p>Total Submitted: </p>
                                    <p>{statistics?.images_submitted}</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <p>Total Approved: </p>
                                    <p>{statistics?.images_approved}</p>
                                </div>
                                <hr />
                            </DashboardCard>
                        </div>
                    </div>
                    : ""}
            </div>
            <Footer />
        </Fragment>
    );
}

export default Dashboard;
