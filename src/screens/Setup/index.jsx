import './style.scss';
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { Fragment } from "react";
import CategoryCard from './CategoriesCard';
import GroupsCard from './GroupsCard';
import UsersCard from './UsersCard';
import SystemConfigurationCard from './SystemConfigurationCard';
import PageMeta from '../../components/PageMeta';


function Setup() {

    return (
        <Fragment>
            <PageMeta title="Setup | Local Voice" />

            <TopNav />
            <div className='py-2' style={{ background: "rgb(240,240,240)" }}>
                <div className="my-3 mx-auto col-md-11 col-11 setup-page">
                    <h4><b>Setup</b></h4>
                    <p className="text-muted mb-4">
                        Setup global configuration for the web and mobile application.
                    </p>

                    <div className="row setup-container">
                        <div className="col-md-6 setup-card-container mx-auto">
                            <SystemConfigurationCard />
                        </div>

                        <div className="col-md-6 setup-card-container mx-auto">
                            <CategoryCard />
                        </div>

                        <div className="col-md-12 setup-card-container mx-auto">
                            <GroupsCard />
                        </div>

                        <div className="col-md-12 mx-auto overflow-scroll">
                            <UsersCard />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </Fragment>
    );
}

export default Setup;
