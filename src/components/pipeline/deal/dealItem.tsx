type params = {
    quote?: any;
    isDragging?: any;
    isGroupedOver?: any;
    provided?: any;
    style?: any;
    isClone?: any;
    index?: any;
  }

 export const DealItem = (props: params) => {
  
    const { quote, isDragging, isGroupedOver, provided, style, isClone, index } = props;
  
    return (
      <>
        <div
          isDragging={isDragging}
          isGroupedOver={isGroupedOver}
          isClone={isClone}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          data-is-dragging={isDragging}
          data-testid={quote?.id}
          data-index={index}
        >
          <div className="pdstage-item">
            <div className='pdstage-box'>
              <a className='pdstage-boxlink' href=''>
                <div className="pdstage-title">Bokani Tshuma</div>
                <div className="pdstage-description">
                  <div className="pdstage-descitem">Esteem care, Bokani Tshuma</div>
                </div>
                <div className="pdstage-status-row">
                  <div className="pdstage-avatar">
                    <i className="rs-icon rs-icon-user-circle"></i>
                  </div>
                  <div className="pdstage-value">
                    <span>£0</span>
                  </div>
                </div>
              </a>
              <div className="pdstage-status-indicator">
                <div className='pdstage-indicator-icon'><i className="rs-icon rs-icon-arrow-circle-left"></i></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }