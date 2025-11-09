import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";

const HandleIdleTime = () => {
    const navigate = useNavigate();
    
    const handleIdle = () => {
        window.alert("You have been logged out due to inactivity");
        navigate("/login");
    }
    useIdleTimeout({ onIdle: handleIdle, idleTime: window.config?.SessionTimeout?.idleTimeoutSeconds || 1200 });

    return(<></>)
}

type params = {
    onIdle: any;
    idleTime: any
}
const useIdleTimeout = (props: params) => {
    const { onIdle, idleTime, ...others } = props;
    const idleTimeout = 1000 * idleTime;
    const [isIdle, setIdle] = useState(false);

    const handleIdle = () => {
        setIdle(true)
    }

    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        promptTimeout: idleTimeout / 2,
        onPrompt: onIdle,
        onIdle: handleIdle,
        debounce: 0
    })
    return {
        isIdle,
        setIdle,
        idleTimer
    }
}

export default HandleIdleTime;

