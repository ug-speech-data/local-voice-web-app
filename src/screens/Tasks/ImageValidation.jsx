import './style.scss';
import React, { useState, useRef } from 'react'
import { Link } from "react-router-dom";
import { useGetImagesToValidateQuery, useValidateImageMutation } from '../../features/resources/resources-api-slice';
import { useToast, Spinner } from '@chakra-ui/react'
import { useEffect } from 'react';
import { Modal } from 'bootstrap';
import TagInput from '../../components/TagInput';
import { mod } from '../../utils/functions';


function ImageValidation() {
    const { data: response = [], isFetching: isFetchingImages, error } = useGetImagesToValidateQuery(1);
    const [validateImage, { isLoading: isValidatingImage, error: imageValidationError }] = useValidateImageMutation()

    const [imageIndex, setImageIndex] = useState(0);
    const [currentImageLoading, setCurrentImageLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const toast = useToast()
    const modalRef = useRef(null);
    const [selectedTags, setSelectedTags] = useState([]);

    // Todo: Get categories from API
    const categories = Array.from({ length: 100 }, () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))

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
        if (response["images"] !== undefined) {
            currentImage = response["images"][imageIndex]
        }
    }

    const handleImageChange = (index) => {
        setImageIndex(mod(index, response["images"].length));
        currentImage = response["images"][imageIndex]

        // Reset selected tags
        setSelectedTags([])

        // Loading image
        setCurrentImageLoading(true)
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

    const handleValidate = async (status) => {
        if (isValidatingImage) return

        const body = { image_id: 1, status }
        const response = await validateImage(body).unwrap()
        if (response['message'] != null) {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: response['message'],
                status: 'success',
                duration: 1000,
                isClosable: true,
            })
        }
        // Next image
        handleImageChange(imageIndex + 1)
    }

    if (imageValidationError) {
        toast({
            position: 'top-center',
            title: `An error occurred: ${imageValidationError.originalStatus}`,
            description: imageValidationError.status,
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }


    return (
        <section className='my-5 image-validation'>
            {response["images"] === undefined || response["images"].length === 0 ?
                <div className="my-3 d-flex justify-content-center align-items-center">
                    <h3>No images to validate</h3>
                </div> : null
            }

            {isFetchingImages &&
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
                <div ref={modalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{currentImage.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                {currentImageLoading && <Spinner
                                    className='center-parent'
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    size="xl"
                                    color='purple.500'
                                />}
                                <img onClick={showModal}
                                    onLoad={() => setCurrentImageLoading(false)}
                                    className="image"
                                    style={{ "opacity": currentImageLoading ? "0.5" : "1" }}
                                    src={currentImage.image_url}
                                    alt="Described image" />
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
                        <div className="row">
                            <div className='col-md-7 mx-auto d-flex align-items-center justify-content-center position-relative'>
                                {currentImageLoading && <Spinner
                                    className='center-parent'
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    size="xl"
                                    color='purple.500'
                                />}
                                <img onClick={showModal}
                                    onLoad={() => setCurrentImageLoading(false)}
                                    className="image"
                                    style={{ "opacity": currentImageLoading ? "0.5" : "1" }}
                                    src={currentImage.image_url}
                                    alt="Described image" />
                            </div>
                            <div className="col-md-3 mx-auto my-4">
                                <div className='my-2'>
                                    <p className='m-0 p-0'><b>Name</b></p>
                                    <p className='m-0 p-0'>{currentImage.name}</p>
                                </div>

                                <div className='my-2 overflow-scroll'>
                                    <p className='m-0 p-0'><b>Source</b></p>
                                    <Link>{currentImage.image_url}</Link>
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

            <div className='my-3'>
                <p className='m-0 p-0'><b>Categories (Select up to 3)</b></p>
                <TagInput tags={categories} selectedTags={selectedTags} setSelectedTags={setSelectedTags} maxSelection={3} />
            </div>

            <div className="d-flex justify-content-center my-4 page-actions">
                <button
                    className="btn btn-outline-danger me-2 p-3"
                    disabled={isValidatingImage}
                    onClick={() => handleValidate("rejected")}>
                    {isValidatingImage ? <Spinner size="sm" /> :
                        <span><i className="bi bi-hand-thumbs-down"></i>Reject</span>
                    }
                </button>
                <button className="btn btn-outline-success me-2 p-3"
                    disabled={isValidatingImage || selectedTags.length < 1}
                    onClick={() => handleValidate("accepted")}>
                    {isValidatingImage ? <Spinner size="sm" /> :
                        <span><i className="bi bi-hand-thumbs-up"></i>Accept</span>
                    }
                </button>
            </div>
        </section >
    );
}

export default ImageValidation;
