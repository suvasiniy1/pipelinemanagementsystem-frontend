import axios, { AxiosError, AxiosResponse, CancelTokenSource } from "axios";
import { UserCredentails } from "../components/login";
import { getActiveUserToken } from "../others/authUtil";


const baseURL=window?.config?.ServicesBaseURL;

export class LoginService{

    constructor(errorHandler: any) {
    }

    login(item: UserCredentails, axiosCancel?: CancelTokenSource, ignoreToastr: boolean = false) {
        var promise = new Promise<any>((resolve, reject) => {
            axios({
                method: 'POST',
                url: `${baseURL}/login`,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Media-type': 'application/json',
                    'Authorization': `Bearer ${getActiveUserToken()}`
                },
                data: item,
                cancelToken: axiosCancel?.token
            }).then((res: AxiosResponse) => {
                console.log("postItem - res: ", res);
                if (res?.data) {
                    resolve(res.data);
                }
                else{
                    resolve(null);
                }
            }).catch((err: AxiosError) => {
                console.log("Exception Occurred - res: ", err, " | Code: ", err.code, " | err.message", err.message,);
                resolve(err?.response?.data);
            });
        });
        return promise;
    }
}