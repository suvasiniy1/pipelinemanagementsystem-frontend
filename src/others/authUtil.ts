export const isUserLoggedIn = (): boolean => {
    let isUserLoggedIn=localStorage.getItem("isUserLoggedIn")
    return (isUserLoggedIn !== null && isUserLoggedIn === 'true');
}