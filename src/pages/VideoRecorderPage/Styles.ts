import { Card } from "@nextui-org/react";
import { styled } from "styled-components";

export const FixedDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  position: fixed;
  margin-bottom: 1rem;
  margin-right: 1rem;
  right: 0;
  bottom: 0;
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

export const WidthDiv = styled.div`
  width: 700px;
`;
