import './style.scss';
import { Fragment } from "react";
import TableView from '../../components/Table';

function AudiosTable() {
    return (
        <Fragment>
            <div className="my-5">
                <TableView
                    responseDataAttribute="images"
                    dataSourceUrl="http://127.0.0.1:8000/api/images/"
                    headers={[{
                        key: "name", value: "Name", render: (item) => {
                            return (
                                <div className="d-flex align-items-center">
                                    {item.name}
                                    {item.is_accepted ?
                                        <span className="ms-1 badge bg-success p-1">Accepted</span>
                                        :
                                        <span className="ms-1 badge bg-danger p-1">Rejected</span>
                                    }
                                </div>
                            )
                        }
                    },
                    { key: "source_url", value: "Source", },
                    {
                        key: "image_url", value: "Image", render: (item) => {
                            return (
                                <div>
                                    <img src={item.image_url} alt={item.name} className="profile-image" />
                                </div>
                            )
                        }
                    }, {
                        key: "categories", value: "Categories", render: (item) => {
                            return (
                                <div>
                                    {item.categories?.map((category, index) => (
                                        <span key={index} className="badge bg-primary me-1">{category.name}</span>
                                    ))}
                                </div>
                            )
                        }
                    }, {
                        key: "validations", value: "Validations", render: (item) => {
                            return (
                                <div>
                                    {item.validations?.map((validation, valIndex) => (
                                        <span key={valIndex} className={validation.is_valid ? 'badge bg-primary' : 'badge bg-danger'}>{validation.user}</span>
                                    ))}
                                </div>
                            )
                        }
                    },
                    { value: "Actions" }]}
                >
                </TableView>
            </div>
        </Fragment >
    );
}

export default AudiosTable;
