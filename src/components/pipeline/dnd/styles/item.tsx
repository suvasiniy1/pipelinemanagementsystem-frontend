import React from 'react';
import styled from '@xstyled/styled-components';
import { borderRadius, grid } from './constants';

const getBackgroundColor = (isDragging: any, isGroupedOver: any, authorColors: any) => {
  if (isDragging) {
    return authorColors.soft;
  }

  if (isGroupedOver) {
    return '#EBECF0';
  }

  return '#FFFFFF';
};

const getBorderColor = (isDragging: any, authorColors: any) =>
  isDragging ? authorColors.hard : 'transparent';

const imageSize = 40;

const CloneBadge = styled.divBox`
  background: #79f2c0;
  bottom: ${grid / 2}px;
  border: 2px solid #57d9a3;
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);
  height: ${imageSize}px;
  width: ${imageSize}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.aBox`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${(props: any) => getBorderColor(props.isDragging, props.colors)};
  background-color: ${(props: any) =>
    getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors)};
  box-shadow: ${(isDragging: boolean) => (isDragging ? `2px 2px 1px #A5ADBA` : 'none')};
  box-sizing: border-box;
  padding: ${grid}px;
  min-height: ${imageSize}px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: #091e42;

  &:hover,
  &:active {
    color: #091e42;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${(props: any) => props?.colors?.hard};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Avatar = styled.imageBox`
  width: ${imageSize}px;
  height: ${imageSize}px;
  border-radius: 50%;
  margin-right: ${grid}px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const Content = styled.divBox`
  /* flex child */
  flex-grow: 1;
  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const BlockQuote = styled.divBox`
  &::before {
    content: open-quote;
  }
  &::after {
    content: close-quote;
  }
`;

const Footer = styled.divBox`
  display: flex;
  margin-top: ${grid}px;
  align-items: center;
`;

const Author = styled.smallBox`
  color: ${(props: any) => props?.colors?.hard};
  flex-grow: 0;
  margin: 0;
  background-color: ${(props: any) => props?.colors?.soft};
  border-radius: ${borderRadius}px;
  font-weight: normal;
  padding: ${grid / 2}px;
`;

const QuoteId = styled.smallBox`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: right;
`;

function getStyle(provided: any, style: any) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

type params = {
  quote?: any;
  isDragging?: any;
  isGroupedOver?: any;
  provided?: any;
  style?: any;
  isClone?: any;
  index?: any;
}
const QuoteItem = (props: params) => {
  const {quote, isDragging, isGroupedOver, provided, style, isClone, index } = props;

  return (
    <>
      <Container
        isDragging={isDragging}
        isGroupedOver={isGroupedOver}
        isClone={isClone}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getStyle(provided, style)}
        data-is-dragging={isDragging}
        data-testid={quote.id}
        data-index={index}
      >
        {/* <Avatar src={quote.author.avatarUrl} alt={quote.author.name} /> */}
        {isClone ? <CloneBadge>Clone</CloneBadge> : null}
        <Content>
          <BlockQuote>{quote.title}</BlockQuote>
          <Footer>
            <Author>{quote.title}</Author>
            <QuoteId>
              id:
              {quote.id}
            </QuoteId>
          </Footer>
        </Content>
      </Container>
    </>
  );
}

export default React.memo(QuoteItem);
