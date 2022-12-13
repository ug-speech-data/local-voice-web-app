import './style.scss';
import { Fragment } from "react";
import { Link } from "react-router-dom";
import logo from "../../logo.svg";
import testWave from '../../assets/audio/test.wav'

function AudiosTable() {
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
                        <th scope="col">Name</th>
                        <th scope="col">Image</th>
                        <th scope="col">Category</th>
                        <th scope="col">Validations</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>


                </tbody>
            </table>
        </Fragment>
    );
}

export default AudiosTable;
