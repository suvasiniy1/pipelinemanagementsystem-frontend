import React from 'react'

 const ErrorFallback = (errorObj: any) => {
    let { error, resetErrorBoundary, ...others } = errorObj;
    console.log("ErrorFallback - error: ", errorObj, " | ErrMsg: ", error.message);

    return (
      <div>
        <p><b>An error occurred! Please contact Administrator.</b></p>
        <p className="text-danger" hidden={error.message === 'Network Error1'}>Message: {error.message}</p>
        <button onClick={errorObj.resetErrorBoundary}>Try again</button>
      </div>
    )
  }

  export default ErrorFallback;