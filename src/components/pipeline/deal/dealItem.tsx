import { useNavigate } from "react-router-dom";
import { Deal } from "../../../models/deal";

type params = {
    deal?: Deal;
    isDragging?: any;
    isGroupedOver?: any;
    provided?: any;
    style?: any;
    isClone?: any;
    index?: any;
  }

 export const DealItem = (props: params) => {
  
    const { deal, isDragging, isGroupedOver, provided, style, isClone, index } = props;
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
          onClick={(e:any)=>navigator(`/deal?id=${deal?.dealID}&pipeLineId=${deal?.pipelineID}`)}
        >
          <div className="pdstage-item" onScroll={(e:any)=>alert("onScroll")}>
            <div className='pdstage-box'>
              <a className='pdstage-boxlink' href=''>
                <div className="pdstage-title">{deal?.name}</div>
                <div className="pdstage-description">
                  <div className="pdstage-descitem">{deal?.title}</div>
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
      </>
    );
  }