import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Mutation, FetchResult, MutationFn } from "react-apollo";
import gql from "graphql-tag";
import { TextInput, TextInputWidth } from "../elements/TextInput";
import { Page } from "./Page";
import { Button } from "../elements/Button";

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

  interface Collection {
    id?: string;
    name: string;
    copyright: string;
    closure: string;
    legalStatus: string;
  }

  interface ICreateCollection {
    collection: Collection;
  }

  interface ICreateCollectionResponse {
    createCollection: Collection;
  }

  const CREATE_COLLECTION = gql`
    mutation CreateCollection($collection: TdrCollectionInput!) {
      createCollection(collection: $collection) {
        id
      }
    }
  `;

  const onClick: (
    fn: MutationFn<ICreateCollectionResponse, ICreateCollection>
  ) => void = async fn => {
    const result: FetchResult<
      ICreateCollectionResponse,
      ICreateCollection
    > = (await fn({
      variables: {
        collection: { name, copyright, closure, legalStatus }
      }
    })) as FetchResult<ICreateCollectionResponse, ICreateCollection>;
    if (result.data) {
      props.history.push(`/upload/${result.data.createCollection.id}`);
    }
  };

  return (
    <Page title="Create Collection">
      <Mutation<ICreateCollectionResponse, ICreateCollection>
        mutation={CREATE_COLLECTION}
      >
        {createCollection => (
          <>
            <fieldset className="govuk-fieldset">
              <TextInput
                value={name}
                onChange={onNameChange}
                id="collectionName"
                labelText="Collection Name"
                width={TextInputWidth.Half}
              />
              <TextInput
                value={copyright}
                onChange={onCopyrightChange}
                id="copyright"
                labelText="Copyright"
                width={TextInputWidth.Half}
              />
              <TextInput
                value={closure}
                onChange={onClosureChange}
                id="closure"
                labelText="Closure"
                width={TextInputWidth.Half}
              />
              <TextInput
                value={legalStatus}
                onChange={onLegalStatusChange}
                id="legalStatus"
                labelText="Legal Status"
                width={TextInputWidth.Half}
              />
              <Button
                text="Create Collection"
                onClick={() => onClick(createCollection)}
              />
            </fieldset>
          </>
        )}
      </Mutation>
    </Page>
  );
};

export { CreateCollection };
