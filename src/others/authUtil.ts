import LocalStorageUtil from "./LocalStorageUtil";
import Constants from "./constants";

export const isUserLoggedIn = (): boolean => {
    let isUserLoggedIn = localStorage.getItem("isUserLoggedIn")
    return (isUserLoggedIn !== null && isUserLoggedIn === 'true');
}

export const getActiveUserToken = (): string => {
    return LocalStorageUtil.getItem(Constants.ACCESS_TOKEN) ?? "";
}