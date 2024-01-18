import axios from "axios";

// define commonRequest function
 export const commonApi = async(method, url, data,header) => {

    // api request configuration
    let config = {
        method,
        url,
        data,
        headers:header?header:{
            "content-type": "application/json"
        }
    }

    // api call using axios
    return await axios(config).then((data) => {
        return data
    }).catch((err) => {
        return err
    })

}