import axios from 'axios';

var inst = axios.create ({
    xsrfCookieName: 'mytoken',
    xsrfHeaderName: 'csrf-token'
});

export default inst;