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

  const createCampaignAndGetId = async (): Promise<string> => {
    const result = await campaignService.createCampaign({
      name: newCampaignName,
      type: "Predictive",
      CountryCode: "GB", // ✅ lowercase matches backend model
      DefaultNumber: "+441615248787",
    });
  console.log("🧪 Create Campaign Result:", result);

      const id =
    (Array.isArray(result) && result.length > 0 && result[0].id?.toString()) ||
    result?.id?.toString();

  if (!id) {
    console.error("❌ Campaign creation returned invalid ID", result);
    throw new Error("Campaign creation failed.");
  }

  return id;
};


  const handleCreateCampaign = async () => {
    try {
      const id = await createCampaignAndGetId();

      const newCampaign: JustcallCampagin = {
        id: parseInt(id),
        name: newCampaignName,
        type: "Predictive",
        createdBy: "",
        createdDate: new Date(0),
        modifiedBy: "",
        modifiedDate: new Date(0),
        updatedBy: "",
        updatedDate: new Date(0),
        userId: 0,
      };

      setCampaigns((prev) => [...prev, newCampaign]);
      setSelectedCampaignId(id);
      setMode("existing");
    } catch (err) {
      console.error("Create campaign failed", err);
      alert("⚠️ Failed to create campaign.");
    }
  };

  const handleSendToCampaign = async () => {
    try {
      let campaignId = selectedCampaignId;

      if (mode === "new" && newCampaignName) {
        campaignId = await createCampaignAndGetId();
        setSelectedCampaignId(campaignId);
      }

      if (!campaignId) {
        alert("❗ Please select or create a campaign.");
        return;
      }

      const contacts = selectedDeals.map((deal) => ({
        campaign_id: parseInt(campaignId, 10), // Ensure campaign_id is a valid integer
        phone_number: deal.phone?.toString().replace(/\D/g, "") || "",
        name: deal.personName || deal.name,
        email: deal.email || "",
        address: deal.address || "N/A",
        birthday: deal.birthday || "1990-01-01",
        occupation: deal.occupation || "Unknown",
  custom_fields: (deal.customFields || []).map((f) => ({
    key: f.key,
    value: f.value,
  })),
      }));
console.log("Final campaign ID (int):", parseInt(campaignId, 10));

console.log("🧪 Contacts payload:", JSON.stringify(contacts, null, 2));
      await campaignService.addContactsToCampaign(contacts);

      alert("✅ Contacts added successfully.");
      onClose();
    } catch (err) {
      console.error("Add contact(s) failed", err);
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
            disabled={mode === "new" ? !newCampaignName : !selectedCampaignId}
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
