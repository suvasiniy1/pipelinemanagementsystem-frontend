import { useState } from "react";
import GenerateElements from "../../../common/generateElements"
import { IControl } from "../../../models/iControl";
import { Stage } from "../../../models/stage"
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import Util from "../../../others/util";
import * as Yup from 'yup';
import styled from "@xstyled/styled-components";
import { grid } from "../dnd/styles/constants";
import { getBackgroundColor } from "../dnd/styles/list";

type params = {
    selectedItem: Stage;
}
export const StageItem = (props: params) => {
    
    const { selectedItem, ...others } = props;
    const [opacity, setOpacity] = useState();
    const [controlsList, setControlsList] = useState<Array<IControl>>([
        { "key": "Name", "value": "name", "isRequired": true, "tabIndex": 1, "isFocus": true, "placeHolder": "User Name", "isControlInNewLine": true, "elementSize": 12 },
        { "key": "Probability", "value": "probability", "isRequired": true, "tabIndex": 2, "placeHolder": "Password", "isControlInNewLine": true, "elementSize": 12 },
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

    return (
        <>
            <FormProvider {...methods}>
                <div style={{ opacity: opacity }}
                    onMouseEnter={(e: any) => { if (selectedItem.id > 0) setOpacity('inherit' as any) }}
                    onMouseLeave={(e: any) => { if (selectedItem.id > 0) setOpacity(0.5 as any) }}>
                    <Wrapper>
                        <GenerateElements   controlsList={controlsList}
                                            selectedItem={selectedItem} />
                        <br />
                    </Wrapper>
                </div>
            </FormProvider>
        </>
    )
}