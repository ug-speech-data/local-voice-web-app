import './style.scss';
import { Fragment, useState } from 'react';


function TabLayout({ children, tabs }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Fragment>
            <nav className='tabs d-flex align-items-center'>
                {tabs.map((tab, index) => (
                    <p key={index} className={'tab-item me-3 m-0 p-0' + (activeTab === index ? ' active' : '')} onClick={() => setActiveTab(index)} ><b>{tab.toUpperCase()}</b></p>
                ))}
            </nav>
            <div className='tab-content'>
                {children[activeTab]}
            </div>
        </Fragment>
    );
}

export default TabLayout;
