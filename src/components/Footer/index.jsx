import { APP_VERSION } from '../../utils/constants';
import './style.scss';


function Footer() {
    return (
        <section className='footer mt-5'>
            <div className="col-md-6 mx-auto">
                <p className="text-center m-0">© 2023 - All Rights Reserved</p>
                <p className='text-center m-0'>University of Ghana - Speech Data</p>
                <p className='text-center m-0'>v{APP_VERSION}</p>
            </div>
        </section>
    );
}

export default Footer;
