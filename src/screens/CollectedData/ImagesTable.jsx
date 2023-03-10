import './style.scss';
import TableView from '../../components/Table';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Modal } from 'bootstrap';
import {
    useDeleteImagesMutation,
    useUpdateImagesMutation,
    useLazyGetCategoriesQuery,
} from '../../features/resources/resources-api-slice';
import { Spinner, useToast } from '@chakra-ui/react';
import TagInput from '../../components/TagInput';
import TextOverflow from '../../components/TextOverflow';
import { BASE_API_URI } from '../../utils/constants';
import useAxios from '../../app/hooks/useAxios';
import PageMeta from '../../components/PageMeta';


function ImagesTable() {
    const [triggerReload, setTriggerReload] = useState(0);

    const [deleteImage, { isLoading: isDeletingImage, error: errorDeletingImage }] = useDeleteImagesMutation()
    const [putImage, { isLoading: isPuttingImage, isSuccess: successPuttingImage, error: errorPuttingImage }] = useUpdateImagesMutation()
    const [getCategories, { data: response = [], isFetching: isFetchingCategories, error }] = useLazyGetCategoriesQuery()

    const deletionModalRef = useRef(null);
    const editImageModalRef = useRef(null);
    const toast = useToast()

    const [selectedImage, setSelectedImage] = useState(null);
    const [deleteAlertModal, setDeleteAlertModal] = useState(null);
    const [editImageModal, setEditImageModal] = useState(null);
    const [newUpdate, setNewUpdate] = useState(null);
    const [urlParams, setUrlParams] = useState("");
    const [categories, setCategories] = useState([])

    // Form input
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [name, setName] = useState('');
    const [source, setSource] = useState('');
    const [isAccepted, setIsAccepted] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);

    useEffect(() => {
        if (editImageModalRef.current !== null && editImageModal === null) {
            const modal = new Modal(editImageModalRef.current)
            setEditImageModal(modal)
        }
        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current)
            setDeleteAlertModal(modal)
        }

        getCategories()
    }, [])

    useEffect(() => {
        if (!isFetchingCategories && Boolean(response?.categories)) {
            const cats = [...response["categories"]]
            cats.sort((x, y) => x.name < y.name ? -1 : x.name > y.name ? 1 : 0)

            setCategories(cats)
        }
    }, [isFetchingCategories])


    const handleDeleteImage = async () => {
        if (selectedImage === null) {
            return
        }
        const response = await deleteImage({ id: selectedImage.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            setNewUpdate({ item: selectedImage, action: "remove" })
            toast({
                position: 'top-center',
                title: `Success`,
                description: "Image deleted successfully",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        } else {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: errorMessage,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
        deleteAlertModal?.hide()
    }

    const showEditImageModal = (image) => {
        setSelectedImage(image)
        editImageModal?.show()
    }

    const showDeleteImageModal = (image) => {
        setSelectedImage(image)
        deleteAlertModal?.show()
    }

    useEffect(() => {
        if (selectedImage) {
            setName(selectedImage.name)
            setSource(selectedImage.source_url)
            setIsAccepted(selectedImage.is_accepted)
            setIsDownloaded(selectedImage.is_downloaded)
            setSelectedCategories(selectedImage?.categories.map(category => category.name))
        }
    }, [selectedImage])

    const handleSubmission = async () => {
        if (selectedImage === null) {
            return
        }
        const body = {
            name,
            id: selectedImage.id,
            source_url: source,
            is_accepted: isAccepted,
            is_downloaded: isDownloaded,
            categories: selectedCategories
        }
        const response = await putImage(body).unwrap()
        if (response?.image !== undefined) {
            setNewUpdate({ item: response.image, action: "update" })
        }
    }

    useEffect(() => {
        if (errorPuttingImage) {
            toast({
                title: `Error: ${errorPuttingImage.status}`,
                description: "An error occurred while updating the image",
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
        if (errorDeletingImage) {
            toast({
                title: `Error: ${errorDeletingImage.status}`,
                description: "An error occurred while deleting the image",
                position: "top-center",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingImage, errorDeletingImage])

    useEffect(() => {
        if (successPuttingImage) {
            toast({
                title: "Success",
                description: "Image updated successfully",
                position: "top-center",
                status: "success",
                duration: 2000,
                isClosable: true,
            })
            editImageModal?.hide()
        }
    }, [successPuttingImage])


    // Bulk actions
    const { trigger: executeBulImageAction, data: bulkActionResponseData, error: bulkActionError, isLoading: isSubmittingBulkAction } = useAxios({ method: "POST" })
    function handleBulImageAction(ids, action) {
        toast({
            id: "submitting",
            title: `Executing actions for ${ids.length} images`,
            status: "info",
            position: "top-center",
            isClosable: true,
        })
        executeBulImageAction(
            `${BASE_API_URI}/images-bulk-actions/`,
            { ids: ids, action: action }
        )
    }

    useEffect(() => {
        toast.close("submitting")
        if (bulkActionResponseData?.message) {
            toast({
                title: `Info`,
                description: bulkActionResponseData?.message,
                status: "info",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
            setTriggerReload((triggerReload) => triggerReload + 1);
        }
    }, [bulkActionResponseData])


    useEffect(() => {
        toast.close("submitting")
        toast.close("error")
        if (bulkActionError) {
            toast({
                id: "error",
                title: `Error`,
                description: bulkActionError,
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [bulkActionError])

    // Image navigation
    const { trigger: navigateImage, data: imageNavigationResponse, error: imageNavigationError, isLoading: imageNavigatonLoading } = useAxios()
    function navigate(direction) {
        navigateImage(
            `${BASE_API_URI}/image-preview-navigation${urlParams}&direction=${direction}&current_image_id=${selectedImage.id}`,
        )
    }

    useEffect(() => {
        if (imageNavigationResponse?.image != null) {
            setSelectedImage(imageNavigationResponse.image)
        }
    }, [imageNavigationResponse])

    useEffect(() => {
        if (imageNavigationError) {
            toast({
                id: "error",
                title: `Error`,
                description: imageNavigationError,
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [imageNavigationError])

    return (
        <section className="images-table">
            <PageMeta title="Collected Images | Speech Data" />

            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Image - '{selectedImage?.name}'
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                <div className="d-flex flex-column">
                                    <h5>Are you sure you want to delete this image?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingImage && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteImage(selectedImage)} >Yes, continue</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={editImageModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedImage ? "Edit Image" : "New Image"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex align-item-center justify-content-center mb-2">
                                <button className="btn btn-primary mx-2"
                                    disabled={imageNavigatonLoading}
                                    onClick={() => navigate("next")}>
                                    <i className="bi bi-arrow-left"></i> Previous
                                </button>
                                <button className="btn btn-primary mx-2"
                                    disabled={imageNavigatonLoading}
                                    onClick={() => navigate("previous")}>
                                    Next <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                            <div className="row">
                                <div className="d-flex justify-content-center align-items-center col-md-8 mx-auto">
                                    <div className="d-flex justify-content-center align-items-center">
                                        {imageNavigatonLoading && <p className='my-2'> <Spinner /></p>}
                                        {!imageNavigatonLoading && <img src={selectedImage?.image_url} alt={selectedImage?.name} />}
                                    </div>
                                </div>

                                {!imageNavigatonLoading &&
                                    <div className="col-md-4 mx-auto">
                                        <div className="my-3">
                                            <label htmlFor="name" className="form-label"><b>Name</b></label>
                                            <input type="text" className="form-control" id="name" value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div className="my-3">
                                            <label htmlFor="name" className="form-label"><b>Source</b></label>
                                            <input type="text" className="form-control" id="name"
                                                onChange={(e) => setSource(e.target.value)}
                                                value={source} />
                                        </div>

                                        <div className="my-3">
                                            <label htmlFor="name" className="form-label"><b>Size</b></label>
                                            <p>{selectedImage?.height} x {selectedImage?.width}</p>
                                        </div>

                                        <div className="my-3">
                                            <label htmlFor="name" className="form-label"><b>Category</b></label>
                                            <p>
                                                <span className="badge bg-primary me-1">{selectedImage?.category}</span>
                                            </p>
                                        </div>

                                        <div className="my-3">
                                            <label htmlFor="name" className="form-label"><b>Date</b></label>
                                            <p>
                                                <span className="badge bg-primary me-1">{selectedImage?.created_at}</span>
                                            </p>
                                        </div>

                                        <div className="my-5">
                                            <label htmlFor="name" className="form-label"><b>Categories</b></label>
                                            <div id='tags-container'>
                                                <TagInput
                                                    tags={categories?.map((category) => category.name).sort()}
                                                    heading="Click to remove"
                                                    selectedTags={selectedCategories}
                                                    setSelectedTags={setSelectedCategories}
                                                />
                                            </div>
                                        </div>

                                        <div className="my-3">
                                            <label htmlFor="name" className="form-label me-2">Accepted</label>
                                            <input type="checkbox" className="form-check-input"
                                                onChange={() => setIsAccepted(!isAccepted)}
                                                checked={isAccepted} />
                                        </div>

                                        <div className="my-3">
                                            <button className='btn btn-sm btn-outline-danger' onClick={() => {
                                                editImageModal?.hide()
                                                showDeleteImageModal(selectedImage)
                                            }

                                            }>Delete image</button>
                                        </div>

                                        <div className="my-3 d-flex justify-content-end">
                                            <button className="btn btn-outline-primary btn-sm"
                                                disabled={isPuttingImage || imageNavigatonLoading}
                                                onClick={handleSubmission}>{isPuttingImage && <Spinner />} Save Changes</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-5 overflow-scroll">
                <TableView
                    reloadTrigger={triggerReload}
                    responseDataAttribute="images"
                    dataSourceUrl={`${BASE_API_URI}/collected-images/`}
                    urlParams={urlParams}
                    setUrlParams={setUrlParams}
                    newUpdate={newUpdate}
                    filters={[
                        { key: "is_accepted:0", value: "Pending" },
                        { key: "is_accepted:1", value: "Accepted" },
                        ...(categories?.map(cat => { return { key: `main_category__name:${cat.name}`, value: `In ${(cat.name || "").toLowerCase()}` } }) || []).sort()
                    ]}
                    bulkActions={[
                        { name: "Approve Selected", action: (bulkSelectedIds) => handleBulImageAction(bulkSelectedIds, "approve") },
                        { name: "Reject Selected", action: (bulkSelectedIds) => handleBulImageAction(bulkSelectedIds, "reject") },
                        { name: "Delete Selected", action: (bulkSelectedIds) => handleBulImageAction(bulkSelectedIds, "delete") },
                    ]}
                    headers={[{
                        key: "name", value: "Name", render: (item) => {
                            return (
                                <div className="d-flex align-items-center">
                                    <TextOverflow text={item.name} width={30} />
                                    {item.is_accepted ?
                                        (<span className='ms-2 p-0 badge bg-success'><i className="bi bi-info-circle"></i></span>)
                                        :
                                        (<span className='ms-2 p-0 badge bg-warning'><i className="bi bi-info-circle" ></i></span>)
                                    }
                                </div>
                            )
                        }
                    }, {
                        key: "image_url", value: "Image", render: (item) => {
                            return (
                                <div>
                                    <img src={item.thumbnail} alt={item.name} onClick={() => showEditImageModal(item)} />
                                </div>
                            )
                        }
                    }, {
                        key: "categories", value: "Categories", render: (item) => {
                            return (
                                <div>
                                    {item.categories?.map((category, index) => (
                                        <span key={index + 1} className="badge bg-primary me-1">{category.name}</span>
                                    ))}
                                </div>
                            )
                        }
                    }, {
                        key: "validations", value: "Validations", render: (item) => {
                            return (
                                <div>
                                    {item.validations?.map((validation, valIndex) => (
                                        <span key={valIndex} className={validation.is_valid ? 'badge bg-primary' : 'badge bg-warning'}>{validation.user}</span>
                                    ))}
                                </div>
                            )
                        }
                    }, {
                        key: "source_url", value: "Source", render: (item) => {
                            return (
                                <a href={item.source_url} target="_blank"><TextOverflow text={item.source_url} /></a>
                            )
                        }
                    }, {
                        value: "Actions", render: (item) => {
                            return (
                                <div className="d-flex">
                                    <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showEditImageModal(item)}>
                                        <i className="bi bi-list me-1"></i>
                                        More
                                    </button>
                                    <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeleteImageModal(item)}>
                                        <i className="bi bi-trash me-1"></i>
                                        Delete
                                    </button>
                                </div>
                            )
                        }
                    }]}
                >
                </TableView>
            </div>
        </section >
    );
}

export default ImagesTable;
