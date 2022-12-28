import './style.scss';
import { Fragment } from "react";


function ImagesTable() {
    return (
        <Fragment>
            <div className="col-md-8">
                <div>
                    <p>Filters</p>
                </div>
            </div>
            <table className='table'>
                <thead>
                    <tr>
                        <th scope="col"><input type="checkbox" /></th>
                        <th scope="col">Name</th>
                        <th scope="col">Image</th>
                        <th scope="col">Category</th>
                        <th scope="col">Validations</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Dummy table here */}
                    <tr>
                        <th scope="col"><input type="checkbox" /></th>
                        <td>Image 1</td>
                        <td><img src="https://via.placeholder.com/150" alt="Image 1" /></td>
                        <td>Category 1</td>
                        <td>Validations 1</td>
                        <td>Actions 1</td>
                    </tr>
                    <tr>
                        <th scope="col"><input type="checkbox" /></th>
                        <td>Image 2</td>
                        <td><img src="https://via.placeholder.com/150" alt="Image 2" /></td>
                        <td>Category 2</td>
                        <td>Validations 2</td>
                        <td>Actions 2</td>
                    </tr>


                </tbody>
            </table>
        </Fragment>
    );
}

export default ImagesTable;
