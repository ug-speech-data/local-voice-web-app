import TopNav from "../../components/TopNav";
import DashboardCard from "../../components/DashboardCard";
import Footer from "../../components/Footer";


function Dashboard() {
    return (
        <>
            <TopNav />
            <div className="p-2">
                <div className="mx-auto d-flex flex-wrap col-lg-8">
                    <h4>YOUR STATS</h4>
                </div>
                <div className="mx-auto d-flex flex-wrap col-lg-8">
                    <DashboardCard >
                        <div className="d-flex justify-content-between mb-2">
                            <h4 className="ms-0 my-0 p-0"><b>Images Submitted</b></h4>
                            <h4 className="m-0 p-0"><b>10</b></h4>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <p className="ms-3 my-1 p-0">Pending</p>
                            <p className="m-0 p-0">10</p>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <p className="ms-3 my-1 p-0">Approved</p>
                            <p className="m-0 p-0">10</p>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <p className="ms-3 my-1 p-0">Rejected</p>
                            <p className="m-0 p-0">10</p>
                        </div>
                    </DashboardCard>
                    <DashboardCard >
                        <div className="d-flex justify-content-between mb-2">
                            <h4 className="ms-0 my-0 p-0"><b>Audios Submitted</b></h4>
                            <h4 className="m-0 p-0"><b>10</b></h4>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <p className="ms-3 my-1 p-0">Pending</p>
                            <p className="m-0 p-0">10</p>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <p className="ms-3 my-1 p-0">Approved</p>
                            <p className="m-0 p-0">10</p>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <p className="ms-3 my-1 p-0">Rejected</p>
                            <p className="m-0 p-0">10</p>
                        </div>
                    </DashboardCard>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Dashboard;
