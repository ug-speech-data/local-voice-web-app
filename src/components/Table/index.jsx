import "./style.scss"
import { Fragment, useState, useEffect } from 'react';
import useAxios from '../../app/hooks/useAxios';

import { Spinner } from '@chakra-ui/react';

function TableView({ headers, responseDataAttribute = "images", dataSourceUrl, newUpdate = null, filters = null }) {
    const [originalData, setOriginalData] = useState([])
    const [displayedData, setDisplayedData] = useState([])
    const { trigger, data: responseData, error, isLoading } = useAxios()
    const [filter, setFilter] = useState("")

    // Filter inputs
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    useEffect(() => {
        console.log("displayedData", displayedData)
        console.log("originalData", originalData)
    }, [displayedData])


    useEffect(() => {
        if (responseData) {
            if (responseDataAttribute === null) {
                return
            }

            setOriginalData(responseData[responseDataAttribute])
            setDisplayedData(responseData[responseDataAttribute])

            setTotalPages(responseData.total_pages)
            setNextPage(responseData.next_page)
            setPreviousPage(responseData.previous_page)
        }
    }, [responseData])

    useEffect(() => {
        trigger(`${dataSourceUrl}?page=${page}&filters=${filter}`)
    }, [page, filter])

    useEffect(() => {
        trigger(`${dataSourceUrl}?page=${page}&filters=${filter}`)
    }, [])

    const reloadData = () => {
        trigger(`${dataSourceUrl}?page=${page}&filters=${filter}`)
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
            <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex">
                        <div className="d-flex align-items-center">
                            <label htmlFor="search" className="form-label me-2">Search</label>
                            <input type="text" className="form-control" id="search" aria-describedby="search"
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                                value={search} />
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
                        <div className="d-flex align-items-center mx-3">
                            <label htmlFor="filter" className="form-label me-2">Filters</label>
                            <select className="form-control"
                                id="filter"
                                onChange={(e) => setFilter(e.target.value)}>
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
                            Refresh
                        </button>
                    </div>

                </div>

                <table className="table">
                    <thead>
                        <tr>
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
                        {error && <tr><td colSpan="2">Error: {error}</td></tr>}

                        {displayedData?.map((item, index) => {
                            return (
                                <tr key={index}>
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
