import "./style.scss"
import { Fragment, useState, useEffect } from 'react';
import useAxios from '../../app/hooks/useAxios';

import { Spinner } from '@chakra-ui/react';

function TableView({ headers, responseDataAttribute = "images", dataSourceUrl, newUpdate = null, filters = null, bulkActions = [] }) {
    const [originalData, setOriginalData] = useState([])
    const [displayedData, setDisplayedData] = useState([])
    const { trigger, data: responseData, error, isLoading } = useAxios()
    const [filter, setFilter] = useState("")

    const [bulkSelected, setBulkSelected] = useState([])
    const [selectedBulkActionIndex, setSelectedBulkActionIndex] = useState(0)

    // Filter inputs
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [pageSize, setPageSize] = useState(10);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    useEffect(() => {
        if (responseData) {
            if (responseDataAttribute === null) {
                return
            }

            setOriginalData(responseData[responseDataAttribute])
            setDisplayedData(responseData[responseDataAttribute])

            setTotalPages(responseData.total_pages)
            setNextPage(responseData.next_page)
            setPage(responseData?.page || 1)
            setPreviousPage(responseData.previous_page)
        }
    }, [responseData])

    useEffect(() => {
        trigger(`${dataSourceUrl}?page=${page}&q=${search}&page_size=${pageSize}&filters=${filter}`)
    }, [page, filter, pageSize])

    useEffect(() => {
        trigger(`${dataSourceUrl}?page=${page}&q=${search}&page_size=${pageSize}&filters=${filter}`)
    }, [])

    const reloadData = () => {
        trigger(`${dataSourceUrl}?page=${page}&q=${search}&page_size=${pageSize}&filters=${filter}`)
    }

    useEffect(() => {
        const filtered = originalData.filter(c => {
            for (const { key } of headers) {
                if (c[key] && typeof c[key] !== 'object' && c[key]?.toLowerCase()?.includes(search?.toLowerCase())) {
                    return true
                }
            }
            return false
        })
        setDisplayedData(filtered)
    }, [search])

    useEffect(() => {
        const toToSorted = [...displayedData]
        toToSorted.sort((a, b) => {
            if (a[sort] < b[sort]) {
                return -1;
            }
            return 1;
        })
        setDisplayedData(toToSorted)
    }, [sort])

    useEffect(() => {
        if (newUpdate === null) {
            return
        }
        const { item, action } = newUpdate
        let newData = [...originalData.filter(c => c.id !== item.id)]
        if (action === "update") {
            newData = [item, ...newData]
        }
        setOriginalData(newData)
        setDisplayedData(newData)
    }, [newUpdate])

    return (
        <Fragment>
            <div className="card-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <div className="d-flex justify-content-between mb-3" style={{ position: "sticky", top: "0", background: "white" }}>
                    <div className="d-flex">
                        <div className="d-flex align-items-center">
                            <label htmlFor="search" className="form-label me-2">Search</label>
                            <input type="search" className="form-control" id="search" aria-describedby="search"
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                                value={search} />
                        </div>
                        <div className="d-flex align-items-center">
                            <select className="form-control" name="page_size" id="page_size" onChange={(e) => setPageSize(e.target.value)} defaultValue={page}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="100">300</option>
                            </select>
                        </div>
                        <div className="d-flex align-items-center mx-3">
                            <button className="btn btn-sm btn-primary"
                                disabled={previousPage == null || isLoading}
                                onClick={() => setPage(page - 1)}
                            >
                                <i className="bi bi-skip-backward"></i>
                            </button>
                            <span className="mx-2 badge bg-primary">page {page} of {totalPages}</span>
                            <button className="btn btn-sm btn-primary"
                                disabled={nextPage == null || isLoading}
                                onClick={() => setPage(page + 1)}
                            >
                                <i className="bi bi-skip-forward"></i>
                            </button>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-end">
                        {bulkActions?.length > 0 &&
                            <div className="d-flex align-items-center mx-3">
                                <select className="form form-select" 
                                defaultValue={selectedBulkActionIndex}
                                onChange={e => setSelectedBulkActionIndex(e.target.value)}>
                                    {bulkActions.map((action, index) => {
                                        return (
                                            <option key={index} value={index}>{action.name}</option>
                                        )
                                    })}
                                </select>
                                <button className="btn btn-light" onClick={bulkActions[selectedBulkActionIndex]?.action}>Go</button>
                            </div>
                        }

                        <div className="d-flex align-items-center mx-3">
                            <label htmlFor="filter" className="form-label me-2">Filters</label>
                            <select className="form form-select"
                                id="filter"
                                defaultValue={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                >
                                <option value="">None</option>
                                {filters?.map(({ key, value }, index) => {
                                    return (
                                        <option key={index} value={key}>{value}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <button className="btn btn-sm btn-light d-flex align-items-center"
                            disabled={isLoading}
                            onClick={reloadData}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Reload
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            {bulkActions?.length > 0 && <th>
                                <input type="checkbox" className="form-check-input" id="bulk_select"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setBulkSelected(displayedData.map(c => c.id))
                                        } else {
                                            setBulkSelected([])
                                        }
                                    }}
                                    checked={bulkSelected.length == displayedData.length}
                                /> </th>}

                            {headers?.map(({ key, value }, index) => {
                                return (
                                    <th key={index} onClick={(e) => setSort(key)}>
                                        <div className="d-flex">
                                            {value.toUpperCase()}
                                            {sort === key && <i className="bi bi-caret-down-fill"></i>}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && <tr><td colSpan={headers?.length || 7}>
                            <span className="text-center d-flex justify-content-center">
                                <Spinner />
                                Loading...
                            </span>
                        </td></tr>}
                        {(!isLoading && displayedData?.length == 0) && <tr><td colSpan={headers?.length || 7}>
                            <p className="text-center">No data to display</p>
                        </td></tr>}
                        {!isLoading && error && <tr><td colSpan="2">Error: {error}</td></tr>}

                        {displayedData?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {bulkActions?.length > 0 && <td>
                                        <input type="checkbox" className="form-check-input" id="bulk_select"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setBulkSelected([...bulkSelected, item.id])
                                                } else {
                                                    setBulkSelected(bulkSelected.filter(c => c != item.id))
                                                }
                                            }}
                                            checked={bulkSelected.includes(item.id)}
                                        />
                                    </td>}

                                    {headers?.map(({ key, render }, headerIndex) => {
                                        return (
                                            <td key={headerIndex}>
                                                {render ? render(item) : typeof item[key] != 'object' ? <span>{item[key]}</span> : "N/A"}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </Fragment >
    );
}

export default TableView;
