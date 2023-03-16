import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import { Fragment } from "react";
import UserPayment from './UserPayment';
import TransactionHistory from './TransactionHistory';
import BalanceWidget from "../../components/BalanceWidget";
import ParticipantsTable from "./ParticipantsTable";


function Payment() {

    return (
        <Fragment>
            <TopNav />
            <div className="my-3 mx-auto col-md-10">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4><b>PAYMENT</b></h4>
                        <p className="text-muted mb-4">Manage users' compensations here. </p>
                    </div>
                    <div className="">
                        <BalanceWidget />
                    </div>
                </div>
                <TabLayout tabs={["Users", "Participants", "History"]}>
                    <UserPayment />
                    <ParticipantsTable />
                    <TransactionHistory />
                </TabLayout>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Payment;
