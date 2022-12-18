import './style.scss';
import { Fragment } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";


function ImageUploader() {
    return (

        <div className="col-md-6 mx-auto my-4">
            <div className='d-flex my-2'>
                <input type="url" placeholder='Image URL' className="form-control" />
                <button className='ms-2 btn btn-primary d-flex'><span className='me-1'>Get</span><span>Image</span></button>
            </div>

            <div className='chosen-image-container'>
                <img src={logo} className="img-fluid" alt="logo" />
            </div>

            <div className='my-4'>
                <h6><b>Image Meta Data</b></h6>
                <div className="form-group my-4">
                    <label htmlFor="image-name">Name</label>
                    <input type="text" className="form-control" id="image-title" placeholder="Enter name" />
                </div>

                <div className="form-group my-4">
                    <label htmlFor="image-name">Category</label>
                    <select name="image_category" id="image_category" className='form-control'>
                        <option value="1">Category 1</option>
                        <option value="2">Category 2</option>
                        <option value="3">Category 3</option>
                    </select>
                </div>

                <hr />
                <p className="text-end my-3"><button className='btn btn-primary'>Submit</button></p>
            </div>
        </div>
    );
}

export default ImageUploader;
