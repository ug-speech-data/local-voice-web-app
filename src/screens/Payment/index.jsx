import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import { Fragment } from "react";
import UserPayment from './UserPayment';
import TransactionHistory from './TransactionHistory';
import BalanceWidget from "../../components/BalanceWidget";
import ParticipantsTable from "./ParticipantsTable";
import OthersPayment from "./OthersPayment";
import PageMeta from "../../components/PageMeta";
import { useParams, useLocation } from 'react-router-dom'
import { useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from 'react'


function Payment() {
    const params = useParams();
    const location = useLocation()
    const [searchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 0);

    useEffect(() => {
        const tab = searchParams.get('tab');
        setCurrentTab(tab || 0)
    }, [location, params])

    return (
        <Fragment>
            <PageMeta title="Payment | Speech Data UG" />
            <TopNav />
            <div className="my-3 mx-auto col-md-11 col-11">
                <div className="row align-items-center mb-3">
                    <div className="col-md-9">
                        <h4><b>PAYMENT</b></h4>
                        <div className="mb-4">
                            <p className="text-muted">Manage user compensations from this dashboard. </p>
                            <p className="text-muted">Navigate to the "Others" tab to initiate money disbursement to any MoMo number.</p>
                        </div>
                    </div>
                    <div className="col-md-3 d-flex justify-content-end">
                        <BalanceWidget />
                    </div>
                </div>
                <TabLayout tabs={["Participants", "Users", "Others", "History"]} currentTab={currentTab}>
                    <ParticipantsTable />
                    <UserPayment />
                    <OthersPayment />
                    <TransactionHistory />
                </TabLayout>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Payment;
