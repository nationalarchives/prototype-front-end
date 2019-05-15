import * as React from "react";
import { Header } from "./Header";
import { getCurrentUser } from "../utils";
import { RouteComponentProps } from "react-router";
import { Mutation, FetchResult } from "react-apollo";
import gql from "graphql-tag";

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

  return (
    <Mutation<ICreateCollectionResponse, ICreateCollection>
      mutation={CREATE_COLLECTION}
    >
      {(createCollection, { data }) => (
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
              <input
                type="text"
                onChange={onClosureChange}
                placeholder="Closure"
              />
              <input
                type="text"
                onChange={onLegalStatusChange}
                placeholder="Legal Status"
              />
              <button
                onClick={async () => {
                  const result: FetchResult<
                    ICreateCollectionResponse,
                    ICreateCollection
                  > = (await createCollection({
                    variables: {
                      collection: { name, copyright, closure, legalStatus }
                    }
                  })) as FetchResult<
                    ICreateCollectionResponse,
                    ICreateCollection
                  >;
                  if (result.data) {
                    props.history.push(
                      `/upload/${result.data.createCollection.id}`
                    );
                  }
                }}
              >
                Create Collection
              </button>
            </div>
          </div>
        </>
      )}
    </Mutation>
  );
};

export { CreateCollection };
