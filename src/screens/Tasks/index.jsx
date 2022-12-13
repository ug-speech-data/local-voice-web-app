import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import TabLayout from "../../components/TabLayout";
import Transcription from "./Transcription";
import ImageValidation from "./ImageValidation";
import AudioValidation from "./AudioValidation";
import { Fragment } from "react";

function Tasks() {
    return (
        <Fragment>
            <TopNav />
            <div className="my-3 mx-auto col-md-8">
                <h4><b>VALIDATION AND TRANSCRIPTION</b></h4>
                <p className="text-muted mb-4">Click on each tab to find available tasks to complete.</p>
                <TabLayout tabs={["Image Validation", "Audio Validation", "Transcription"]}>
                    <ImageValidation />
                    <AudioValidation />
                    <Transcription />
                </TabLayout>
            </div>

            <Footer />
        </Fragment>
    );
}

export default Tasks;
