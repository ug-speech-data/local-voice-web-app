import './style.scss';
import React, { useState, useRef, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useGetImageToValidateQuery, useLazyGetCategoriesQuery, useValidateImageMutation } from '../../features/resources/resources-api-slice';
import { useToast, Spinner } from '@chakra-ui/react'
import { Modal } from 'bootstrap';
import TagInput from '../../components/TagInput';
import { useSelector } from 'react-redux';


function ImageValidation() {
    const configurations = useSelector((state) => state.global.configurations);

    //HACK : offset is used to trigger a new request to the API
    const [offset, setOffset] = useState(-1);

    const { data: response = [], isFetching: isFetchingImages, error } = useGetImageToValidateQuery(offset);
    const [getCategories, { data: categoryResponse = [], isFetching: isFetchingCategory, error: errorFetchingCategory }] = useLazyGetCategoriesQuery()
    const [categories, setCategories] = useState([])
    const [validateImage, { isLoading: isValidatingImage, error: imageValidationError }] = useValidateImageMutation()
    const [currentImageLoading, setCurrentImageLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const toast = useToast()
    const modalRef = useRef(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);

    useEffect(() => {
        if (categoryResponse["categories"] !== undefined) {
            setCategories(categoryResponse["categories"]?.map((category) => category["name"]))
        }
    }, [isFetchingCategory])

    useEffect(() => {
        getCategories()
        setCurrentImageLoading(false)
    }, [])

    useEffect(() => {
        if (error && !isFetchingImages) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${error.originalStatus}`,
                description: error.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        } else {
            if (response["image"] !== undefined) {
                setCurrentImage(response["image"])
                setCurrentImageLoading(true)
            }
        }
    }, [isFetchingImages])

    useEffect(() => {
        if (response?.message) {
            setResponseMessage(response.message)
        }
    }, [response])

    const handleImageChange = () => {
        // Reset selected tags
        setSelectedTags([])

        setOffset(currentImage.id || 0)
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

        const body = { image_id: currentImage.id, categories: selectedTags, status }
        const response = await validateImage(body).unwrap()
        if (response['message'] != null) {
            toast({
                position: 'top-center',
                title: `Success`,
                description: response['message'],
                status: 'success',
                duration: 1000,
                isClosable: true,
            })
        }
        // Next image
        handleImageChange()
    }

    if (imageValidationError & !isFetchingImages) {
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
            <p>For each image, select the appropriate category. Also, <b>reject</b> images that <b>are of low resolution or contains water marks</b></p>

            {Boolean(currentImage) === false ?
                <div className="my-4">
                    <h4 className='text-center h4'>No more images to validate</h4>
                    {responseMessage && <p className='text-center text-warning'>{responseMessage}</p>}
                    <p className='text-center my-3'><button className='btn btn-primary'
                        disabled={isFetchingImages}
                        onClick={() => setOffset(-Math.abs(offset) - 1)}>
                        {isFetchingImages && <Spinner />}
                        Reload
                    </button></p>
                </div> : null
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
                                {(currentImageLoading || isFetchingImages) && <Spinner
                                    className='center-parent'
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    size="xl"
                                    color='purple.500'
                                />}
                                <img onClick={showModal}
                                    className="image"
                                    style={{ "opacity": (currentImageLoading || isFetchingImages) ? "0.5" : "1" }}
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
                    <div className="col-11 mx-auto">
                        <div className="row">
                            <div className='col-md-7 mx-auto d-flex align-items-center justify-content-center position-relative'>
                                {(currentImageLoading || isFetchingImages) && <Spinner
                                    className='center-parent'
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    size="xl"
                                    color='purple.500'
                                />}
                                <img onClick={showModal}
                                    onLoad={() => setCurrentImageLoading(false)}
                                    onChange={() => setCurrentImageLoading(true)}
                                    className="image"
                                    style={{ maxHeight: "50vh", "opacity": (currentImageLoading || isFetchingImages) ? "0.5" : "1" }}
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
                                    <p>{currentImage.source_url}</p>
                                </div>

                                <div className='my-2 overflow-scroll'>
                                    <p className='m-0 p-0'><b>Size</b></p>
                                    <p className='m-0 p-0'>{currentImage.height} x {currentImage.width}</p>
                                </div>

                                <div className='my-2 overflow-scroll'>
                                    <p className='m-0 p-0'><b>Date</b></p>
                                    <p className='m-0 p-0'>{currentImage.created_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {currentImage &&
                <div className='my-3'>
                    <p className='m-0 p-0'><b>Categories (Select up to {configurations?.max_category_for_image || 3})</b></p>
                    <TagInput tags={categories.sort()} selectedTags={selectedTags} setSelectedTags={setSelectedTags} maxSelection={configurations?.max_category_for_image || 3} />
                </div>
            }

            <div className="d-flex justify-content-center my-5 p-2 page-actions">
                <button
                    className="btn btn-outline-danger me-2 px-3"
                    disabled={isValidatingImage || currentImageLoading || Boolean(currentImage) === false}
                    onClick={() => handleValidate("rejected")}>
                    {isValidatingImage ? <Spinner size="sm" /> :
                        <span><i className="bi bi-hand-thumbs-down me-1"></i>Reject</span>
                    }
                </button>
                <button
                    className="btn btn-outline-primary mx-3 px-3"
                    disabled={isValidatingImage}
                    onClick={handleImageChange}>
                    <span><i className="bi bi-skip-forward me-1"></i>Skip</span>
                </button>
                <button className="btn btn-outline-success me-2 px-3"
                    disabled={isValidatingImage || currentImageLoading || selectedTags.length < 1}
                    onClick={() => handleValidate("accepted")}>
                    {isValidatingImage ? <Spinner size="sm" /> :
                        <span><i className="bi bi-hand-thumbs-up me-1"></i>Accept</span>
                    }
                </button>
            </div>
        </section >
    );
}

export default ImageValidation;
