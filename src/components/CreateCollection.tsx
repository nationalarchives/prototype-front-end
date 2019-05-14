import * as React from "react";
import { Header } from "./Header";
import { getCurrentUser } from "../utils";
import { RouteComponentProps } from "react-router";
import { getAuthorisationHeaders, RequestHeader } from "../utils/user";
import Axios from "axios";

const CreateCollection: React.FunctionComponent<
  RouteComponentProps
> = props => {
  type StringState = [string, React.Dispatch<string>];

  type ChangeType = (event: React.ChangeEvent<HTMLInputElement>) => void;

  const [name, setName]: StringState = React.useState("");
  const [copyright, setCopyright]: StringState = React.useState("");
  const [closure, setClosure]: StringState = React.useState("");
  const [legalStatus, setLegalStatus]: StringState = React.useState("");

  const onNameChange: ChangeType = event => {
    setName(event.currentTarget.value);
  };

  const onCopyrightChange: ChangeType = event => {
    setCopyright(event.currentTarget.value);
  };

  const onClosureChange: ChangeType = event => {
    setClosure(event.currentTarget.value);
  };

  const onLegalStatusChange: ChangeType = event => {
    setLegalStatus(event.currentTarget.value);
  };
  const createCollection: () => void = async () => {
    const headers: RequestHeader = await getAuthorisationHeaders();
    console.log(headers["Authorization"]);
    Axios.post(
      "https://rtkxqs3978.execute-api.eu-west-2.amazonaws.com/dev/collection/",
      { name, copyright, closure, legalStatus },
      {
        headers
      }
    ).then(response => {
      props.history.push(`/upload/${response.data.id}`);
    });
  };

  return (
    <>
      <Header
        signedIn={getCurrentUser() !== null}
        text="Create Collection"
        {...props}
      />
      <div id="createCollection">
        <div id="collectionInputs">
          <input
            type="text"
            onChange={onNameChange}
            placeholder="Collection Name"
          />
          <input
            type="text"
            onChange={onCopyrightChange}
            placeholder="Copyright"
          />
          <input type="text" onChange={onClosureChange} placeholder="Closure" />
          <input
            type="text"
            onChange={onLegalStatusChange}
            placeholder="Legal Status"
          />
          <button onClick={createCollection}>Create Collection</button>
        </div>
      </div>
    </>
  );
};

export { CreateCollection };
