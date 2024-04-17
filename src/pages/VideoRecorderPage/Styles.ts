import { Card } from "@nextui-org/react";
import { styled } from "styled-components";

interface FixedDivProps {
  hidden?: boolean;
}

export const FixedDiv = styled.div<FixedDivProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  position: fixed;
  margin-bottom: 1rem;
  margin-right: 1rem;
  right: 0;
  bottom: 0;
  visibility: ${(props) => (props.hidden ? "hidden" : "visible")};
`;

export const FixedButton = styled.div`
  transform: rotate(180deg);
`;

export const MenueCard = styled(Card)`
  width: 300px;
  max-width: 400px;
  transition: all 500ms ease-in-out;
  transform: scale(1);
  z-index: 50;
`;

export const AnnotationListDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FlexRowDiv = styled.div`
  display: flex;
  margin: 3rem;
  justify-content: space-around;

  @media (max-width: 1620px) {
    flex-direction: column;
    align-items: center; /* Optional: Centers items horizontally */
  }
`;

export const BackButtonContainer = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const WidthDiv = styled.div`
  margin-top: 15px;
  width: 700px;
`;
