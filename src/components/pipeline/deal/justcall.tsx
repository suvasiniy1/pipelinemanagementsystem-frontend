import { JustCallDialer } from "@justcall/justcall-dialer-sdk";
import { useEffect, useState } from "react";
import { DealService } from "../../../services/dealService";
import { ErrorBoundary } from "react-error-boundary";

type params = {
  phoneNumber: string;
  setPhoneNumber: any;
  dealItem: any;
};

const JustCallComponent = (props: params) => {
  const { phoneNumber, setPhoneNumber, dealItem } = props;
  const [dialer, setDialer] = useState<JustCallDialer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [listenerAttached, setListenerAttached] = useState(false);
  const dealService = new DealService(ErrorBoundary);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioInputs = devices.filter((device) => device.kind === "audioinput");
      console.log("🎧 Detected microphones:", audioInputs);
    });
  }, []);

  useEffect(() => {
    if (!phoneNumber) return;

    const init = async () => {
      const checkContainer = () =>
        !!document.getElementById("justcall-dialer-container");

      if (!checkContainer()) {
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (checkContainer()) {
              clearInterval(interval);
              resolve(true);
            }
          }, 100);
        });
      }

      const dialerInstance = new JustCallDialer({
        dialerId: "justcall-dialer-container",
        onLogin: (data) => console.log("✅ Logged in:", data),
        onLogout: () => console.log("❌ Logged out"),
        onReady: () => {
          console.log("✅ JustCall Dialer is ready");
          setIsReady(true);
        },
      });

      setDialer(dialerInstance);
    };

    init();
  }, [phoneNumber]);

  useEffect(() => {
    const openDialer = async () => {
      if (!dialer || !isReady || listenerAttached) return;

      await dialer.ready();
      const isLoggedIn = await dialer.isLoggedIn();
      if (!isLoggedIn) return;

      dialer.dialNumber(phoneNumber);

      dialer.on("call-ended", async (callData: any) => {
        console.log("📞 Call ended:", callData);

        // Log basic call details
        console.log("Basic call details logged. Waiting for detailed data via webhook.");
      });

      setListenerAttached(true);
    };

    openDialer();
  }, [dialer, isReady, listenerAttached]);

  return (
    <div>
      {phoneNumber && (
        <div className="dialer-popup">
          <div className="dialer-header">
            <span>JustCall Dialer</span>
            <button onClick={() => setPhoneNumber(null)}>✖</button>
          </div>
          <div id="justcall-dialer-container" />
        </div>
      )}
    </div>
  );
};

export default JustCallComponent;