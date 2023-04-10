import './style.scss';
import { Fragment, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";


function TabLayout({ children, tabs, currentTab = 0 }) {
    const [activeTab, setActiveTab] = useState(Number.parseInt(currentTab));
    const bodies = children.filter((item) => Boolean(item))
    const [searchParams, setSearchParams] = useSearchParams();

    const setCurrentTab = (index) => {
        setSearchParams({ "tab": index })
    }

    useEffect(() => {
        setActiveTab(Number.parseInt(currentTab))
    }, [currentTab])

    return (
        <Fragment>
            <nav className='tabs d-flex align-items-center'>
                {tabs.map((tab, index) => (
                    <p key={index} className={'tab-item me-3 m-0 p-0' + (activeTab === index ? ' active' : '')} onClick={() => { setActiveTab(index); setCurrentTab(index) }} ><b>{tab.toUpperCase()}</b></p>
                ))}
            </nav>
            <div className='tab-content'>
                {bodies[activeTab]}
            </div>
        </Fragment>
    );
}

export default TabLayout;
