import * as React from "react";

interface IButtonProps {
  text: string;
  onClick: (...args: any[]) => void;
}

const Button: React.FunctionComponent<IButtonProps> = props => {
  return (
    <div className="govuk-form-group">
      <button className="govuk-button" onClick={props.onClick}>
        {props.text}
      </button>
    </div>
  );
};

export { Button };
