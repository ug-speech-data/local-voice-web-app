import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import ImageUploader from "./ImageUploader";
import { Fragment } from "react";

function Contribute() {
    return (
        <Fragment>
            <TopNav />
            <div className="my-3 mx-auto col-md-8">
                <h4><b>CONTRIBUTE</b></h4>
                <p className="text-muted mb-4">Click on each tab to contribute.</p>
                <TabLayout tabs={["Image"]}>
                    <ImageUploader />
                    <br />
                </TabLayout>
            </div>

            <Footer />
        </Fragment>
    );
}

export default Contribute;
