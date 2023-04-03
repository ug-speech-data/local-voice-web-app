import './style.scss';
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { Fragment } from "react";
import CategoryCard from './CategoriesCard';
import GroupsCard from './GroupsCard';
import UsersCard from './UsersCard';
import SystemConfigurationCard from './SystemConfigurationCard';
import PageMeta from '../../components/PageMeta';
import { NavLink, Outlet } from "react-router-dom";


function Setup() {

    return (
        <Fragment>
            <PageMeta title="Setup | Speech Data UG" />

            <TopNav />
            <div className='py-2' style={{ background: "rgb(240,240,240)" }}>
                <div className="my-3 mx-auto col-md-11 col-11 setup-page">
                    <h4><b>Setup</b></h4>
                    <p className="text-muted mb-4">
                        Setup global configuration for the web and mobile application.
                    </p>

                    <div className='row'>
                        <div className="col-md-2">
                            <nav className='side-nav'>
                                <h4 className='my-2'><NavLink to="/setup/users">Users</NavLink></h4>
                                <h4 className='my-2'><NavLink to="/setup/system-configuration">System Configuration</NavLink></h4>
                                <h4 className='my-2'><NavLink to="/setup/groups">Groups/Roles</NavLink></h4>
                                <h4 className='my-2'><NavLink to="/setup/categories">Image Categories</NavLink></h4>
                            </nav>
                        </div>
                        <div className="col-md-9  setup-container">
                            <div className='setup-card-container'>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </Fragment>
    );
}

export default Setup;
