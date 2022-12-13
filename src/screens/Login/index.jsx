import './style.scss';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';


function LoginScreen() {
    return (
        <div className="login-page">
            <form className="col-md-3 col-10 mx-auto login-card">
                <h5 className='text-center'>LOGIN</h5>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required />
                </div>

                <div className="form-group my-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" aria-describedby="emailHelp" placeholder="Enter password" required />
                    <p className="text-end"><Link>Forgot Password</Link></p>
                </div>
                <div className="form-group my-3">
                    <p className="text-center"><button className='btn btn-primary'>Login</button></p>
                </div>

                <div className="form-group my-3">
                    <Link to="/register">Don't have an account? Register here</Link>
                </div>
            </form>
            <Footer />
        </div>
    );
}

export default LoginScreen;
