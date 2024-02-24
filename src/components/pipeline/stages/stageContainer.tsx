import { Draggable } from "react-beautiful-dnd";
import Title from "../dnd/styles/title";
import styled from "@xstyled/styled-components";
import { borderRadius, grid } from "../dnd/styles/constants";
import { colors } from "@atlaskit/theme";
import TextBox from "../../../elements/TextBox";
import { StageItem } from "./stageItem";
import { Stage } from "../../../models/stage";

type params = {
    title: any,
    index: any,
    selectedItem:Stage
}
export const StageContainer = (props: params) => {
    const { title, index, selectedItem, ...others } = props;

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
    background-color: ${(isDragging: any) =>
        isDragging ? colors.G50 : colors.N30};
    transition: background-color 0.2s ease;
    &:hover {
      background-color: ${colors.G50};
    }
  `;

    return (
        <>
            <Draggable draggableId={title} index={index}>
                {(provided, snapshot) => (
                    <Container ref={provided.innerRef} {...provided.draggableProps}>
                        <Header isDragging={snapshot.isDragging}>
                            <Title
                                isDragging={snapshot.isDragging}
                                {...provided.dragHandleProps}
                                aria-label={`${title} quote list`}
                            >
                                {title}
                            </Title>
                        </Header>
                        <StageItem selectedItem={selectedItem}/>
                    </Container>
                )}
            </Draggable>
        </>
    )
}