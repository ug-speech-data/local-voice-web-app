import TopNav from "../../components/TopNav";
import { Link } from 'react-router-dom';
import Footer from "../../components/Footer";


function Dashboard() {
    return (
        <>
            <TopNav />
            <div className="p-2">
                <div className="mx-auto d-flex flex-wrap col-lg-8">
                    <h4>DATA SUMMARY</h4>
                </div>
                <div className="mx-auto col-lg-8">
                    <p className="text-warning">No info here</p>

                    <p className="my-4">
                        Go to  <Link to="/profile"><button className="btn btn-sm btn-primary">Profile</button></Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Dashboard;
