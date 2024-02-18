import { styled } from "styled-components";

export const VideoLabel = styled.div`
  margin-left: 12px;
  font-weight: 500;
  font-size: medium;
  color: ${({ theme }) => theme.colors.text};
`;

export const VideoContainer = styled.div`
  width: 450px;
  height: 400px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 4%;
  cursor: pointer;
  &:hover {
    transform: scale(1.01);
    transition: all 0.4s ease;
  }
`;
