import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import Transcription from "./Transcription";
import ImageValidation from "./ImageValidation";
import AudioValidation from "./AudioValidation";
import TranscriptionValidation from "./TranscriptionValidation";
import { Fragment } from "react";

function Tasks() {
    return (
        <Fragment>
            <TopNav />
            <div className="my-3 mx-auto col-md-10 col-11">
                <h4><b>VALIDATION AND TRANSCRIPTION</b></h4>
                <p className="text-muted mb-4">Click on each tab to find available tasks to complete.</p>
                <TabLayout tabs={["Image Validation", "Audio Validation", "Transcription", "Transcription Validation"]}>
                    <ImageValidation />
                    <AudioValidation />
                    <Transcription />
                    <TranscriptionValidation />
                </TabLayout>
            </div>

            <Footer />
        </Fragment>
    );
}

export default Tasks;
