import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import { Fragment } from "react";
import UserPayment from './UserPayment';
import TransactionHistory from './TransactionHistory';
import BalanceWidget from "../../components/BalanceWidget";
import ParticipantsTable from "./ParticipantsTable";
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
                <TabLayout tabs={["Participants", "Users", "History"]} currentTab={currentTab}>
                    <ParticipantsTable />
                    <UserPayment />
                    <TransactionHistory />
                </TabLayout>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Payment;
