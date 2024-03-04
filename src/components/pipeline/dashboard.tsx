import 'bootstrap/dist/css/bootstrap.min.css';
import Board from './dnd/board/Board';
import { generateQuoteMap } from './dnd/mockData';
import { DashboardHeader } from './dashboardHeader';
import { useState } from 'react';
import { Stage } from '../../models/stage';


export const Dashboard = () => {

  const [rowData, setRowData] = useState<Array<Stage>>(JSON.parse(localStorage.getItem("stagesList") as any) ?? []);

  const data = {
    medium: generateQuoteMap(5),
    large: generateQuoteMap(5),
  };

  const updateRowData = () => {
    
    setRowData(JSON.parse(localStorage.getItem("stagesList") as any) ?? []);
  }

  return (
    <>
      <DashboardHeader canAddDeal={rowData.length > 0} onSaveChanges={(e: any) => updateRowData()} />
      
      <div className="pdstage-area">
        <div className="container-fluid">
          <div className="pdstage-row">
            <div className="pdstage-col">
                <div className="pdstage-innercol">
                    <div className="pdstage-header">
                        <div className="pdstage-head">New Lead</div>
                        <div className="pdstage-summary">
                            <div className="pdstage-value">
                                <span className='pdstage-price'>£0</span><span className='pdstage-num'>6 deals</span>
                            </div>
                        </div>
                    </div>
                    <div className='pdstage-list'>
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

                      <div className="pdstage-item">
                        <div className='pdstage-box'>
                          <a className='pdstage-boxlink' href=''>
                            <div className="pdstage-title">Lem Deng Stok</div>
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
                    <div className="pdstage-add"><button className='pdstage-addplus'><i className="rs-icon rs-icon-plus"></i></button></div>
                </div>
            </div>

            <div className="pdstage-col">
                <div className="pdstage-innercol">
                    <div className="pdstage-header">
                        <div className="pdstage-head">1st Call</div>
                        <div className="pdstage-summary">
                            <div className="pdstage-value">
                                <span className='pdstage-price'>£0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pdstage-add"><button className='pdstage-addplus'><i className="rs-icon rs-icon-plus"></i></button></div>
                </div>
            </div>

            <div className="pdstage-col">
                <div className="pdstage-innercol">
                    <div className="pdstage-header">
                        <div className="pdstage-head">2nd Call</div>
                        <div className="pdstage-summary">
                            <div className="pdstage-value">
                                <span className='pdstage-price'>£0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pdstage-add"><button className='pdstage-addplus'><i className="rs-icon rs-icon-plus"></i></button></div>
                </div>
            </div>

            <div className="pdstage-col">
                <div className="pdstage-innercol">
                    <div className="pdstage-header">
                        <div className="pdstage-head">3rd Call</div>
                        <div className="pdstage-summary">
                            <div className="pdstage-value">
                                <span className='pdstage-price'>£0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pdstage-add"><button className='pdstage-addplus'><i className="rs-icon rs-icon-plus"></i></button></div>
                </div>
            </div>

            <div className="pdstage-col">
                <div className="pdstage-innercol">
                    <div className="pdstage-header">
                        <div className="pdstage-head">4th Call</div>
                        <div className="pdstage-summary">
                            <div className="pdstage-value">
                                <span className='pdstage-price'>£0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pdstage-add"><button className='pdstage-addplus'><i className="rs-icon rs-icon-plus"></i></button></div>
                </div>
            </div>

            <div className="pdstage-col">
                <div className="pdstage-innercol">
                    <div className="pdstage-header">
                        <div className="pdstage-head">5th Call</div>
                        <div className="pdstage-summary">
                            <div className="pdstage-value">
                                <span className='pdstage-price'>£0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pdstage-add"><button className='pdstage-addplus'><i className="rs-icon rs-icon-plus"></i></button></div>
                </div>
            </div>

            <div className="pdstage-col">
                <div className="pdstage-innercol">
                    <div className="pdstage-header">
                        <div className="pdstage-head">6th Call</div>
                        <div className="pdstage-summary">
                            <div className="pdstage-value">
                                <span className='pdstage-price'>£0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pdstage-add"><button className='pdstage-addplus'><i className="rs-icon rs-icon-plus"></i></button></div>
                </div>
            </div>


            

          </div>
        </div>
      </div>
      
      {/* <Board initial={data.medium} rowData={rowData}/> */}
      
    </>
  );
}
