import { colors } from "@atlaskit/theme";
import styled from "@xstyled/styled-components";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Stage } from "../../../models/stage";
import { borderRadius, grid } from "../dnd/styles/constants";
import Title from "../dnd/styles/title";
import { StageItem } from "./stageItem";
import DeleteIcon from '@material-ui/icons/Delete';

type params = {
    title: any,
    index: any,
    selectedItem: Stage
    onDeleteClick:any;
}
export const StageContainer = (props: params) => {
    const { title, index, selectedItem, onDeleteClick, ...others } = props;
    const [opacity, setOpacity] = useState();

    const Container = styled.divBox`
    margin: ${grid}px;
    display: flex;
    flex-direction: column;
  `;

    const Header = styled.divBox`
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: ${borderRadius}px;
    border-top-right-radius: ${borderRadius}px;
    background-color: ${colors.N30};
    transition: background-color 0.2s ease;`;

    const Footer = styled.divBox`
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: ${borderRadius}px;
    border-top-right-radius: ${borderRadius}px;
    background-color: ${colors.N30};
    transition: background-color 0.2s ease;`;

    const deleteStage = (index:number) => {
        props.onDeleteClick(index);
    }

    return (
        <>
            <div>
                <Draggable draggableId={title} index={index}>
                    {(provided, snapshot) => (
                        <Container ref={provided.innerRef} {...provided.draggableProps}>
                            <div style={{ opacity: opacity }}
                                onMouseEnter={(e: any) => { setOpacity('inherit' as any) }}
                                onMouseLeave={(e: any) => { setOpacity(0.5 as any) }}
                                >
                                <Header isDragging={snapshot.isDragging}>
                                    <Title
                                        isDragging={snapshot.isDragging}
                                        {...provided.dragHandleProps}
                                        aria-label={`${title} quote list`}
                                    >
                                        {title}
                                    </Title>

                                </Header>
                                <div style={{ borderTop: "1px solid #D7D6D5"}}>
                                    <StageItem selectedItem={selectedItem} />
                                </div>
                                <div style={{ borderTop: "1px solid #D7D6D5", cursor: "pointer" }}>
                                    <Footer><span onClick={(e: any) => deleteStage(index)}><DeleteIcon /> Delete Stage</span>
                                        <br />
                                        <br />
                                    </Footer>

                                </div>
                            </div>

                        </Container>
                    )}
                </Draggable>
            </div>
        </>
    )
}