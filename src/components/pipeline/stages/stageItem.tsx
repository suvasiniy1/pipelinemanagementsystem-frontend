import { useState } from "react";
import GenerateElements from "../../../common/generateElements"
import { ElementType, IControl } from "../../../models/iControl";
import { Stage } from "../../../models/stage"
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import Util from "../../../others/util";
import * as Yup from 'yup';
import styled from "@xstyled/styled-components";
import { grid } from "../dnd/styles/constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScaleBalanced, faBell, faInfoCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

export const getBackgroundColor = (isDraggingOver: any, isDraggingFrom: any) => {
    if (isDraggingOver) {
        return '#FFEBE6';
    }
    if (isDraggingFrom) {
        return '#E6FCFF';
    }
    return '#EBECF0';
};

type params = {
    selectedItem?: Stage;
    provided?: any;
    onAddClick:any;
}
export const StageItem = (props: params) => {
    
    const { selectedItem, provided, ...others } = props;
    const [controlsList, setControlsList] = useState<Array<IControl>>([
        { "key": "Name", "value": "name", "isRequired": true, "tabIndex": 1, "isFocus": true, "isControlInNewLine": true, "elementSize": 12 },
        { "key": "Probability", "value": "probability", "type": ElementType.number, "min": 0, "max": 100, "isRequired": true, "tabIndex": 2, "isControlInNewLine": true, "elementSize": 12 },
    ]);

    const validationsSchema = Yup.object().shape({
        ...Util.buildValidations(controlsList)
    });

    const formOptions = { resolver: yupResolver(validationsSchema) };
    const methods = useForm(formOptions);
    const { handleSubmit, getValues, setValue } = methods;

    const Wrapper = styled.divBox`
    background-color: ${(props: { isDraggingOver: any; isDraggingFrom: any; }) => getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
    display: flex;
    flex-direction: column;
    padding: ${grid}px;
    border: ${grid}px;
    padding-bottom: 0;
    transition: background-color 0.2s ease, opacity 0.1s ease;
    user-select: none;
    width: 250px;
    `;

    const scrollContainerHeight = 250;

    const DropZone = styled.divBox`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

    return (
        <>
            <div ref={provided?.innerRef} {...provided?.dragHandleProps}>
                <div className="editstagebox">
                    <div className="editstage-head">
                        <div className="editstage-headin">
                            <div className="editstage-headlead">
                                <div className="editstage-leadtitle">{selectedItem?.stageName}</div>
                                <div className="editstage-leadicons">
                                    <div className="editstage-leadicon"><FontAwesomeIcon icon={faScaleBalanced} /> {selectedItem?.probability}%</div>
                                    <div className="editstage-bellicon"><FontAwesomeIcon icon={faBell} /> 0 days</div>
                                </div>
                            </div>
                            <div className="editstage-dragicon"><i className="rs-icon rs-icon-pause"></i></div>
                        </div>
                        <button className="editstage-plusicon plusiconleft" onClick={(e:any)=>props.onAddClick("left")}><i className="rs-icon rs-icon-plus"></i></button>
                        <button className="editstage-plusicon plusiconright" onClick={(e:any)=>props.onAddClick("right")}><i className="rs-icon rs-icon-plus"></i></button>
                    </div>
                    <div className="editstage-data">
                        <div className="editstage-innerdata">
                            <div className="editstage-field">
                                <div className="editstage-fieldname">Name</div>
                                <div className="editstage-fieldinput">
                                    <div className="editstage-inputbox">
                                        <input className="form-control" type="text" defaultValue={selectedItem?.stageName} />
                                    </div>
                                </div>
                            </div>
                            <div className="editstage-field">
                                <div className="editstage-fieldname">Probability <div className="editstage-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div></div>
                                <div className="editstage-fieldinput">
                                    <div className="editstage-inputbox">
                                        <input className="form-control" min="0" type="number" defaultValue={selectedItem?.probability} />
                                    </div>
                                </div>
                            </div>
                            <div className="editstage-field">
                                <div className="editstage-fieldcheck">
                                    <div className="editstage-checkbox">
                                        <label className="checktogglebox"><input type="checkbox" /><div className="checktoggle"></div></label>
                                        <div className="fieldchecklabel">Rotting in (days)</div>
                                        <div className="fieldcheck-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div>
                                    </div>
                                    <div className="editstage-inputbox">
                                        <input className="form-control" min="0" type="number" defaultValue="0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="editstage-delete">
                            <div className="editstage-deleteinn">
                                <button className="editstage-deletebtn"><FontAwesomeIcon icon={faTrash} /> <span>Delete Stage</span></button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}