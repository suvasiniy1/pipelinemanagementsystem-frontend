import { useEffect, useState } from "react";
import { JustcallCampaignService } from "../../../services/justCallCampaignService";
import { ErrorBoundary } from "react-error-boundary";
import { JustcallCampagin } from "../../../models/justcallCampagin";
import { Deal } from "../../../models/deal";
import "../../../justCallModal.css";

type Props = {
  selectedDeals: Deal[];
  isOpen: boolean;
  onClose: () => void;
};

const campaignService = new JustcallCampaignService(ErrorBoundary);

const JustCallCampaignModal = ({ selectedDeals, isOpen, onClose }: Props) => {
  const [campaigns, setCampaigns] = useState<JustcallCampagin[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [newCampaignName, setNewCampaignName] = useState<string>("");
  const [mode, setMode] = useState<"existing" | "new">("existing");

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const data = await campaignService.getJustCallCampaignList();
        setCampaigns(data);
      } catch (err) {
        console.error("Failed to load campaigns", err);
      }
    }

    if (isOpen) {
      loadCampaigns();
    }
  }, [isOpen]);

  const handleCreateCampaign = async () => {
    try {
      const result = await campaignService.createCampaign({
        name: newCampaignName,
        type: "Predictive",
        country_code: "US",
        default_number: "+1681381XXXX",
      });

      const newCampaign: JustcallCampagin = {
        id: result.id,
        name: result.name,
        type: result.type,
        createdBy: "",
        createdDate: new Date(0),
        modifiedBy: "",
        modifiedDate: new Date(0),
        updatedBy: "",
        updatedDate: new Date(0),
        userId: 0,
      };
      setCampaigns((prev) => [...prev, newCampaign]);
      setSelectedCampaignId(result.id.toString());
      setMode("existing");
    } catch (err) {
      console.error("Create campaign failed", err);
    }
  };

  const handleSendToCampaign = async () => {
    try {
      for (const deal of selectedDeals) {
        await campaignService.addContactToCampaign({
          campaign_id: selectedCampaignId,
          contact_number: deal.phone,
          name: deal.personName || deal.name,
          email: deal.email || "",
        });
      }
      alert("✅ Contacts added successfully.");
      onClose();
    } catch (err) {
      console.error("Add contact failed", err);
      alert("⚠️ Error sending contacts to campaign.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="justcall-modal-backdrop">
      <div className="justcall-modal">
        <h2>Select Campaign</h2>
        <p>Select an existing campaign or create a new one to add contacts.</p>

        <div className="justcall-option">
          <input
            type="radio"
            id="existing"
            name="mode"
            checked={mode === "existing"}
            onChange={() => setMode("existing")}
          />
          <label htmlFor="existing">Existing Campaign</label>
          {mode === "existing" && (
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
            >
              <option value="">-- Select Campaign --</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="justcall-option">
          <input
            type="radio"
            id="new"
            name="mode"
            checked={mode === "new"}
            onChange={() => setMode("new")}
          />
          <label htmlFor="new">New Campaign</label>
          {mode === "new" && (
            <div style={{ marginTop: "8px" }}>
              <input
                type="text"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                placeholder="Enter campaign name"
              />
              <button onClick={handleCreateCampaign} disabled={!newCampaignName}>
                Create Campaign
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px" }}>
          <button
            onClick={handleSendToCampaign}
            disabled={!selectedCampaignId}
            className="send-btn"
          >
            Send Selected Contacts
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default JustCallCampaignModal;
