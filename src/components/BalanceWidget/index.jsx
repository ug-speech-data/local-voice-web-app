import "./style.scss"
import { Fragment, useEffect } from 'react';
import useAxios from '../../app/hooks/useAxios';
import { BASE_API_URI } from '../../utils/constants';
import { useSelector, useDispatch } from 'react-redux';

import { Spinner, useToast } from '@chakra-ui/react';
import { setBalance as setStoreBalance } from '../../features/global/global-slice';


function BalanceWidget() {
    const balance = useSelector((state) => state.global.balance);
    const { trigger, data: responseData, error, isLoading } = useAxios()

    const toast = useToast()
    const dispatch = useDispatch();

    useEffect(() => {
        if (responseData?.balance !== null || responseData?.balance !== undefined) {
            dispatch(setStoreBalance(responseData?.balance))
        }
    }, [responseData])

    useEffect(() => {
        if (error && !isLoading) {
            toast({
                title: `Error`,
                description: error,
                status: "error",
                position: "top-center",
                duration: 2000,
                isClosable: true,
            })
        }
    }, [error, isLoading])

    return (
        <Fragment>
            <div className="balance-display d-flex align-items-center">
                <p>Balance : GHC {balance !== null ? balance : "--"}</p>
                <button className="ms-4 me-2 btn btn-sm btn-outline-primary"
                    disabled={isLoading}
                    onClick={() => trigger(`${BASE_API_URI}/payments/balance`)}>
                    {isLoading && <Spinner size="sm" />}
                    {!isLoading && <i className="bi bi-arrow-clockwise"></i>}
                </button>
            </div>
        </Fragment >
    );
}

export default BalanceWidget;
