import { useNavigate } from "react-router-dom";
import { Deal } from "../../../models/deal";
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import MoveDeal from "./moveDeal";
import { PipeLine } from "../../../models/pipeline";


type params = {
  deal?: Deal;
  isDragging?: any;
  isGroupedOver?: any;
  provided?: any;
  style?: any;
  isClone?: any;
  index?: any;
  onDeleteClick?: any;
  pipeLinesList:Array<PipeLine>;
  onDealModify:any;
}

export const DealItem = (props: params) => {

  const { deal, isDragging, isGroupedOver, provided, style, isClone, index, onDeleteClick, pipeLinesList, onDealModify } = props;
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const navigator = useNavigate();


  return (
    <>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        data-is-dragging={isDragging}
        data-testid={deal?.dealID}
        data-index={index}
        key={index}
      >
        <div className="pdstage-item">
          <div className='pdstage-box'>
            <a className='pdstage-boxlink'>
              <div className="pdstage-title">{deal?.treatmentName}
              </div>
              <div>
                <Dropdown className='dropdownbox-toolgripdot' style={{ cursor: 'pointer' }}>
                  <Dropdown.Toggle className='toolgrip-dot' variant="success" id="dropdown-toolgripdot"><FontAwesomeIcon icon={faEllipsisVertical} /></Dropdown.Toggle>
                  <Dropdown.Menu className='toolgrip-dropdown'>
                    <Dropdown.Item onClick={(e: any) => onDeleteClick()}>Delete</Dropdown.Item>
                    <Dropdown.Item disabled>Won</Dropdown.Item>
                    <Dropdown.Item disabled>Lost</Dropdown.Item>
                    <Dropdown.Item onClick={(e: any) => setDialogIsOpen(true)}>Move To</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="pdstage-description">
                <div className="pdstage-descitem"><a href="" onClick={(e: any) => navigator(`/deal?id=${deal?.dealID}&pipeLineId=${deal?.pipelineID}`)}>{deal?.personName}</a></div>
              </div>
              <div className="pdstage-status-row">
                <div className="pdstage-avatar">
                  <i className="rs-icon rs-icon-user-circle"></i>
                </div>
                <div className="pdstage-value">
                  <span>£{deal?.value}</span>
                </div>
              </div>
            </a>
            {/* <div className="pdstage-status-indicator">
                <div className='pdstage-indicator-icon'><i className="rs-icon rs-icon-arrow-circle-left"></i></div>
              </div> */}
          </div>
        </div>
      </div>
      {
        dialogIsOpen && <MoveDeal dialogIsOpen={dialogIsOpen}
                                  pipeLinesList={pipeLinesList}
                                  selectedPipeLineId={deal?.pipelineID as any}
                                  setDialogIsOpen={setDialogIsOpen}
                                  dealId={deal?.dealID as any}
                                  onDealModify={(e:any)=>props.onDealModify()}
                                  deal={deal as any}
                                  selectedStageId={deal?.stageID as any} />
      }
    </>
  );
}