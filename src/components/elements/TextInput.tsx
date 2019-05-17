import * as React from "react";
import { UpdateFields } from "../../utils";

export enum TextInputWidth {
  Full = "full",
  ThreeQuarters = "three-quarters",
  TwoThirds = "two-thirds",
  Half = "one-half",
  Third = "one-third",
  Quarter = "one-quarter"
}

interface ITextInputProps {
  value: string;
  onChange: UpdateFields;
  id: string;
  type?: string;
  labelText: string;
  width: TextInputWidth;
}

const TextInput: React.FunctionComponent<ITextInputProps> = props => {
  return (
    <div className="govuk-form-group">
      <label className="govuk-label" htmlFor={props.id}>
        {props.labelText}
      </label>
      <input
        className={`govuk-input govuk-!-width-${props.width}`}
        id={props.id}
        name={props.id}
        type={props.type || "text"}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export { TextInput };
