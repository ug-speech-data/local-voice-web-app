// export let BASE_API_URI = 'http://192.168.0.137:8000/api';
export let BASE_API_URI = 'http://127.0.0.1:8000/api';

export const APP_VERSION = "2.2.1"

if (process.env.NODE_ENV === 'production') {
    const url = window.location.href;
    if (url.search("://app.") >= 0) {
        BASE_API_URI = 'https://sdapi2.ugspeechdata.com/api'
    } else if (url.search("://cloud.") >= 0) {
        BASE_API_URI = 'https://cloudapi.ugspeechdata.com/api'
    } else {
        BASE_API_URI = 'https://sdapi.ugspeechdata.com/api'
    }
}
