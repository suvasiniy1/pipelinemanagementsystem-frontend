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
     // Add this method to verify the 2FA code
     verifyTwoFactorCode(item: { userId: number; verificationCode: string; email: string }, axiosCancel?: CancelTokenSource) {
        return new Promise<any>((resolve, reject) => {
            axios({
                method: 'POST',
                url: `${baseURL}/Login/VerifyTwoFactorCode`, // Ensure this matches the backend endpoint
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${getActiveUserToken()}`
                },
                data: item,
                cancelToken: axiosCancel?.token
            }).then((res: AxiosResponse) => {
                if (res?.data) {
                    resolve(res.data);
                } else {
                    resolve(null);
                }
            }).catch((err: AxiosError) => {
                console.log("Exception Occurred - res: ", err, " | Code: ", err.code, " | err.message", err.message,);
                resolve(err?.response?.data);
            });
        });
    }
}