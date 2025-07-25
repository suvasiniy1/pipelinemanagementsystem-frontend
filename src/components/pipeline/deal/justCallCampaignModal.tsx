import React from "react";
import JustCallCampaignManager from "./justCallCampaignManager";

const JustCallCampaignModal = ({ isOpen, onClose, selectedDeals }: any) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} style={{ float: "right" }}>Close</button>
       <JustCallCampaignManager
  selectedDeals={selectedDeals}
  isOpen={isOpen}
  onClose={onClose}
/>
      </div>
    </div>
  );
};

export default JustCallCampaignModal;
