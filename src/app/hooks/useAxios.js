import { useRef, useState } from "react";
import axios from "axios";


const useAxios = (mainUrl = null, method = "GET", payload = {}) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const controllerRef = useRef(new AbortController());

    const cancel = () => {
        controllerRef.current.abort();
    };

    const trigger = async (url = mainUrl) => {
        try {
            setIsLoading(true);
            const response = await axios.request({
                data: payload,
                signal: controllerRef.current.signal,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                method,
                url,
            });
            setData(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return { trigger, data, error, isLoading, cancel };
};

export default useAxios;