import { styled } from "styled-components";

interface ButtonProps {
  error?: boolean;
  disabled?: boolean;
  varient?: "Primary" | "Secondary";
}

const Button = styled.button<ButtonProps>`
  background: ${({ theme, varient }) =>
    varient === "Secondary" ? theme.colors.secondary : theme.colors.primary};
  border-radius: 999px;
  box-shadow: #5e5df0 0 10px 20px -10px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  opacity: 1;
  outline: 0 solid transparent;
  padding: 8px 18px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;

  &:hover {
    transform: scale(1.01);
    transition: all 0.4s ease;
  }

  ${(props) =>
    props.disabled &&
    `
      pointer-events: none;
      opacity: 0.5;
    `}

  ${(props) =>
    props.error &&
    `
      background-color: #dc3545;
    `}
`;

export default Button;
