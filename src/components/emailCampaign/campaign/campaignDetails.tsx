import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router";
import Util from "../../../others/util";
import { CampaignService } from "../../../services/campaignSerivce";
import CampaignSection from "./campaignSection";

const CampaignDetails = () => {
  const [error, setError] = useState<AxiosError>();
  const [isLoading, setIsLoading] = useState(true);
  const campaignSections: Array<any> = window.config?.CampaignSections;
  const campaignSvc = new CampaignService(ErrorBoundary);
  const [campaignId, setCampaignId] = useState(
    new URLSearchParams(useLocation().search).get("id") as any
  );
  const [campaignItem, setCampaignItem] = useState<any>();
  const navigator = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, []);

  const loadData = () => {
    ;
    campaignSvc
      .getItem(+campaignId, "mockData/campaigns.json")
      .then((res) => {
        setCampaignItem(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
        <div className="pdstage-detail">
          <div className="campaign-sidebardetail-col">
            <div className="sidebardetailtopbar">
              <div
                className="appdealtopbartitle"
                onClick={(e: any) => navigator("/Campaigns")}
              >
                <a href="javascript:void(0);">
                  <FontAwesomeIcon icon={faAngleLeft} /> Campaigns
                </a>{" "}
              </div>
            </div>
            <div className="app-dealblock">
              <div className="app-dealblock-inner">
                <div className="appdealblock-title">
                  <h3>Campaign Details</h3>
                </div>
                <div className="appdealblock-data">
                  {Object.keys(campaignItem).map((item, index) => (
                    <>
                      <div className="appdealblock-row">
                        <div className="appdeal-amount dflex">
                          <b>{Util.capitalizeFirstChar(item)}: </b>
                          <span className="appdeal-amountnum">
                            {campaignItem[item]}
                          </span>
                        </div>
                      </div>
                      <br />
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="timelinecontent-col">
            <div className="timelinecontent">
              <div className="timeline-block">
                <div className="timeline-blockinner">
                  <Tabs
                    defaultActiveKey={campaignSections[0]}
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-5 timelinetab-block"
                  >
                    {campaignSections.map((item, index) => (
                      <Tab
                        key={index}
                        eventKey={item}
                        title={item}
                        className="timelinetab overviewtab"
                      >
                        <CampaignSection sectionType={item} />
                      </Tab>
                    ))}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignDetails;
