import './style.scss';
import { Link } from "react-router-dom";


function TopNav() {
    return (
        <header className="top-nav d-flex justify-content-between">
            <div className='nav-left'>
                <Link to="/" className='nav-menu-item active'>Home</Link>
                <Link to="/contribute" className='nav-menu-item'>Contribute</Link>
                <Link to="/tasks" className='nav-menu-item'>Validation and Transcription</Link>
                <Link to="/collected-data" className='nav-menu-item'>Collected Data</Link>
            </div>
            <div className='nav-right'>
                <Link to="" className='nav-menu-item'>Setup</Link>
                <Link to="" className='nav-menu-item'>Username</Link>
            </div>
        </header>
    );
}

export default TopNav;
