import './style.scss';
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { Fragment } from "react";
import CategoryCard from './CategoriesCard';
import GroupsCard from './GroupsCard';


function Tasks() {

    return (
        <Fragment>
            <TopNav />
            <div className="my-3 mx-auto col-md-10 col-11 setup-page">
                <h4><b>Setup</b></h4>
                <p className="text-muted mb-4">
                    Setup global configuration for the web and mobile application.
                </p>

                <div className="row setup-container">
                    <div className="col-md-6 setup-card-container">
                        <GroupsCard />
                    </div>

                    <div className="col-md-6 setup-card-container">
                        <CategoryCard />
                    </div>

                    <div className="col-md-6 setup-card-container">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <h1>GLOBAL CONFIGURATIONS</h1>
                                <div className="d-flex card-options justify-content-end">
                                    <button className="btn btn-primary btn-sm">Save</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="form-group my-2">
                                    <p>Maximum Image Category</p>
                                    <input className="form-control" type="text" />
                                </div>
                                <div className="form-group my-2">
                                    <p>Maximum Image Category</p>
                                    <input className="form-control" type="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </Fragment>
    );
}

export default Tasks;
