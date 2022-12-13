import './style.scss';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';


function RegisterScreen() {
    return (
        <div className="register-page">
            <form className="col-md-3 col-10 mx-auto register-card">
                <h5 className='text-center'>REGISTER</h5>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required />
                </div>

                <div className="form-group my-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" aria-describedby="emailHelp" placeholder="Enter password" required />
                </div>

                <div className="form-group my-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" aria-describedby="emailHelp" placeholder="Enter password" required />
                </div>

                <div className="form-group my-3">
                    <p className="text-center"><button className='btn btn-primary'>Register</button></p>
                </div>

                <div className="form-group my-3">
                <Link to="/login">Already have an account? Login here</Link>
                </div>
            </form>
            <Footer />
        </div>
    );
}

export default RegisterScreen;
