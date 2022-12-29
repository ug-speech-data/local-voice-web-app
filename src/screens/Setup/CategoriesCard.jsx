import {
    useLazyGetCategoriesQuery,
    usePutCategoriesMutation,
    useDeleteCategoriesMutation,
} from '../../features/resources/resources-api-slice';
import { Fragment, useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useToast, Spinner } from '@chakra-ui/react';

function CategoryCard() {
    const [getCategories, { data: response = [], isFetching, error }] = useLazyGetCategoriesQuery()
    const modalRef = useRef(null);
    const deletionModalRef = useRef(null);
    const [modal, setModal] = useState(null);
    const [deleteAlertModal, setDeletionAlertModal] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const toast = useToast()
    const [categories, setCategories] = useState([])

    const [putCategory, { isLoading: isPuttingCategory, error: errorPuttingCategory }] = usePutCategoriesMutation()
    const [deleteCategory, { isLoading: isDeletingCategory, error: errorDeletingCategory }] = useDeleteCategoriesMutation()

    // Form input
    const [name, setName] = useState('');

    useEffect(() => {
        setCategories(response["categories"])
    }, [isFetching])


    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        if (modalRef.current !== null && modal === null) {
            const modal = new Modal(modalRef.current, { keyboard: false })
            setModal(modal)
        }

        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current, { keyboard: false })
            setDeletionAlertModal(modal)
        }
    }, [])

    const showEditCategoryModal = (category) => {
        setSelectedCategory(category)
        setName(category.name)
        modal?.show()
    }

    const showNewFormCategoryModal = () => {
        setSelectedCategory(null)
        setName('')
        modal?.show()
    }

    const handleDeleteCategory = async () => {
        const response = await deleteCategory({ id: selectedCategory.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            setCategories(categories.filter(c => c.id !== selectedCategory.id))
            toast({
                position: 'top-center',
                title: `Success`,
                description: "Category deleted successfully",
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

    const showDeleteCategoryAlert = (category) => {
        setSelectedCategory(category)
        deleteAlertModal?.show()
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const body = { name }
        if (selectedCategory) {
            body['id'] = selectedCategory.id
        }
        const response = await putCategory(body).unwrap()
        const category = response["category"]
        if (category !== undefined) {
            setCategories([category, ...categories.filter(c => c.id !== category.id)])
        }

        modal?.hide()
        setName('')
    }

    useEffect(() => {
        if (errorPuttingCategory) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorPuttingCategory.originalStatus}`,
                description: errorPuttingCategory.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingCategory])


    useEffect(() => {
        if (errorDeletingCategory) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorDeletingCategory.status}`,
                description: errorDeletingCategory.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorDeletingCategory])

    return (
        <Fragment>
            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Category - '{selectedCategory?.name}'
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                <div className="d-flex flex-column">
                                    <h5>Are you sure you want to delete this category?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingCategory && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteCategory(selectedCategory)} >Yes, continue</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={modalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedCategory ? "Edit Category" : "New Category"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center overflow-scroll">
                            <form onSubmit={handleFormSubmit}>
                                <input type="hidden" name="id"
                                    value={selectedCategory ? selectedCategory.id : ""} />

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" aria-describedby="name"
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter category name"
                                        value={name} />
                                </div>
                                <div className="mb-3">
                                    <p className="text-end">
                                        <button
                                            className='btn btn-sm btn-primary d-flex align-items-center'
                                            disabled={isPuttingCategory}>
                                            {isPuttingCategory && <Spinner />}
                                            Submit
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">

                            <button type="button"
                                className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header d-flex justify-content-between" style={{ "position": "sticky", "top": "-1em", "zIndex": "1", "background": "white" }}>
                    <h1>CATEGORY</h1>
                    <div className="d-flex card-options justify-content-end">
                        <button className="btn btn-primary btn-sm" onClick={showNewFormCategoryModal} >Add</button>
                    </div>
                </div>
                <div className="card-body overflow-scroll">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetching && <tr><td colSpan="2">Loading...</td></tr>}
                            {(!isFetching && categories?.length == 0) && <tr><td colSpan="2">No categories</td></tr>}
                            {error && <tr><td colSpan="2">Error: {error.status}</td></tr>}
                            {categories && categories?.map((category, index) => (
                                <tr key={index}>
                                    <td>{category.name}</td>
                                    <td className='d-flex'>
                                        <button className="mx-1 btn btn-outline-primary btn-sm d-flex"
                                            onClick={() => showEditCategoryModal(category)}>
                                            <i className="bi bi-pen me-1"></i> Edit
                                        </button>
                                        <button className="mx-1 btn btn-outline-primary btn-sm d-flex"
                                            onClick={() => showDeleteCategoryAlert(category)}
                                        ><i className="bi bi-trash me-1"></i> Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment >
    );
}

export default CategoryCard;
