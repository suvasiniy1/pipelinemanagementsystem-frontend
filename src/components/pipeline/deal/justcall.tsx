import { JustCallDialer } from "@justcall/justcall-dialer-sdk";
import { useEffect, useState } from "react";

type params={
phoneNumber:any,
setPhoneNumber:any
}
const JustCallComponent = (props:params) => {
  const {phoneNumber, setPhoneNumber, ...others}=props;
  const [dialer, setDialer] = useState<JustCallDialer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // To toggle pop-up visibility

  useEffect(() => {
    if (phoneNumber) {
      const dialerInstance = new JustCallDialer({
        dialerId: "justcall-dialer-container",
        onLogin: (data) => {
          console.log("Client logged in:", data);
        },
        onLogout: () => {
          console.log("Client logged out");
        },
        onReady: () => {
          console.log("JustCall Dialer is ready");
          setIsReady(true);
        },
      });

      setDialer(dialerInstance);

    //   return () => {
    //     dialerInstance?.destroy(); // Cleanup on unmount
    //   };
    }
  }, [phoneNumber]);

  useEffect(()=>{
    if(isReady==true){
        openDialer();
    }
  },[isReady])

  const openDialer = async () => {
    await dialer?.ready();
    const isLoggedIn = await dialer?.isLoggedIn();
    dialer?.dialNumber(phoneNumber);
  };

  return (
    <div>
      {/* Floating Button */}
      {/* <button onClick={() => setIsVisible(true)} className="dialer-button">
        📞
      </button> */}

      {/* Pop-up Dialer Window */}
      {phoneNumber && (
        <div className="dialer-popup">
          <div className="dialer-header">
            <span>JustCall Dialer</span>
            <button onClick={() => setPhoneNumber(null)}>✖</button>
          </div>
          <div id="justcall-dialer-container"></div>
        </div>
      )}
    </div>
  );
};

export default JustCallComponent;
