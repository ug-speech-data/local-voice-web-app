import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import AudiosTable from "./AudiosTable";
import ImagesTable from "./ImagesTable";
import { Fragment } from "react";
import TranscriptionsTable from "./TranscriptionsTable";
import ParticipantsTable from "./ParticipantsTable";

function CollectedData() {
    return (
        <Fragment>
            <TopNav />
            <div className="my-3 mx-auto col-md-10">
                <h4><b>COLLECTED DATA</b></h4>
                <p className="text-muted mb-4">Click on each tab to find available tasks to complete.</p>
                <TabLayout tabs={["Images", "Audios", "Transcriptions", "Participants"]}>
                    <ImagesTable />
                    <AudiosTable />
                    <TranscriptionsTable />
                    <ParticipantsTable />
                </TabLayout>
            </div>
            <Footer />
        </Fragment>
    );
}

export default CollectedData;
