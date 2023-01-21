import React, { useState, useRef, useEffect } from 'react'
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import { Fragment } from "react";
import { Modal } from 'bootstrap';
import UserPayment from './UserPayment';


function Payment() {
    const customPayModalRef = useRef(null);
    const [customPayModal, setCustomPayModal] = useState(null)


    useEffect(() => {
        if (customPayModalRef.current !== null && customPayModal === null) {
            const modal = new Modal(customPayModalRef.current, { keyboard: false })
            setCustomPayModal(modal)
        }
    }, [])

    const showPaymentModal = () => {
        customPayModal?.show()
    }

    return (
        <Fragment>
            <div ref={customPayModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Export Data</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <TopNav />
            <div className="my-3 mx-auto col-md-10">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4><b>PAYMENT</b></h4>
                        <p className="text-muted mb-4">Manage users' compensations here. </p>
                    </div>
                    <div className="">
                        <button className="btn btn-outline-primary" onClick={showPaymentModal}>
                            <i className="bi bi-file-spreadsheet"></i> Make Payment
                        </button>
                    </div>
                </div>
                <TabLayout tabs={["Users", "History"]}>
                    <UserPayment />
                    <h1>History</h1>
                </TabLayout>
            </div>
            <Footer />
        </Fragment>
    );
}

export default Payment;
