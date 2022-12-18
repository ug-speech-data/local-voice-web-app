import './style.scss';
import React, { useState, useRef } from 'react'
import { Link } from "react-router-dom";
import { useGetImagesToValidateQuery } from '../../features/resources/resources-api-slice';
import { useToast, Spinner } from '@chakra-ui/react'
import { useEffect } from 'react';
import { Modal } from 'bootstrap';

const mod = (n, m) => (n % m + m) % m;

function ImageValidation() {
    const { data: images = [], isFetching, error } = useGetImagesToValidateQuery(1);
    const [imageIndex, setImageIndex] = useState(0);
    const [modal, setModal] = useState(null);
    const toast = useToast()
    const modalRef = useRef(null);

    let currentImage = null;
    if (error) {
        toast({
            position: 'top-center',
            title: `An error occurred`,
            description: error.data.detail,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    } else {
        if (images["images"] !== undefined) {
            currentImage = images["images"][imageIndex]
        }
    }

    const handleImageChange = (index) => {
        setImageIndex(mod(index, images["images"].length));
        currentImage = images["images"][imageIndex]
    }

    useEffect(() => {
        if (modalRef.current !== null && modal === null) {
            const modal = new Modal(modalRef.current, { keyboard: false })
            setModal(modal)
        }
    })


    const showModal = () => {
        modal?.show()
    }

    return (
        <section className='my-5'>
            {isFetching &&
                <div className="my-3 d-flex justify-content-center">
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='purple.500'
                        size='xl' />
                </div>
            }

            {currentImage &&
                <div ref={modalRef} className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{currentImage.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body d-flex justify-content-center">
                                <img lassName="image" src={currentImage.image_url} alt="Described image" />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {currentImage &&
                <div className="row my-5">
                    <div className="col-1 d-flex align-items-center">
                        <button className="btn-control text-muted" onClick={() => handleImageChange(imageIndex - 1)}>
                            <i className="bi bi-arrow-left"></i>
                        </button>
                    </div>
                    <div className="col-10">
                        <div className="d-flex justify-content-center">
                            <p className="col-md-4 mx-auto">
                                <img onClick={showModal} className="image" src={currentImage.image_url} alt="Described image" />
                            </p>
                            <div className="col-md-6 mx-auto my-4">
                                <div className='my-2'>
                                    <p className='m-0 p-0'><b>Name</b></p>
                                    <p className='m-0 p-0'>{currentImage.name}</p>
                                </div>

                                <div className='my-2'>
                                    <p className='m-0 p-0'><b>Source</b></p>
                                    <Link>{currentImage.image_url}</Link>
                                </div>

                                <div className='my-3'>
                                    <p className='m-0 p-0'><b>Categories</b></p>
                                    <p className='m-0 p-0'>Category 1</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-1 d-flex align-items-center">
                        <button className="btn-control text-muted" onClick={() => handleImageChange(imageIndex + 1)}>
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            }
            <div className="d-flex justify-content-center my-4">
                <button className="btn btn-outline-primary me-2"> <i className="bi bi-hand-thumbs-down"></i> Reject</button>
                <button className="btn btn-outline-primary me-2"> <i className="bi bi-hand-thumbs-up"></i> Accept</button>
            </div>
        </section >
    );
}

export default ImageValidation;
