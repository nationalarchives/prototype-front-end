import * as React from "react";
import AWS, { Credentials } from "aws-sdk";
import { getCurrentUser } from "../../utils";
import { FileUploadArea } from "../elements/FileUploadArea";
import { FileInfoTable } from "../elements/FileInfoTable";
import { RouteComponentProps } from "react-router";
import { Mutation, MutationFn } from "react-apollo";
import gql from "graphql-tag";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Page } from "./Page";
import { Button } from "../elements/Button";
import { getCognitoLoginId, getIdentityPoolId } from "../../utils/user";

interface IUploadProps {
  id?: string;
}

interface IUpdateFileInfo {
  id: string;
  checksum: string;
  size: string;
  path: string;
  lastModifiedDate: string;
  fileName: string;
}

export interface IUpdateFile extends IUpdateFileInfo {
  file: File;
}

interface IUpdateFileInput {
  collectionId: string;
  files: IUpdateFileInfo[];
}

const Upload: React.FunctionComponent<
  RouteComponentProps<IUploadProps>
> = props => {
  const [isLoading, setIsLoading]: [
    boolean,
    React.Dispatch<boolean>
  ] = React.useState<boolean>(false);

  const [fileUpdate, setFileUpdate]: [
    IUpdateFile[],
    React.Dispatch<IUpdateFile[]>
  ] = React.useState<IUpdateFile[]>([]);

  const onFilesProcessed: (
    updateFiles: IUpdateFile[]
  ) => void = updateFiles => {
    if (JSON.stringify(updateFiles) !== JSON.stringify(fileUpdate)) {
      setFileUpdate(updateFiles);
      setIsLoading(false);
    }
  };

  const upload: () => void = () => {
    var Bucket = "tdr-files";
    var s3: AWS.S3 = new AWS.S3({
      params: { Bucket }
    });
    const cognitoUser: CognitoUser | null = getCurrentUser();
    if (cognitoUser !== null) {
      cognitoUser.getSession(function(err: any, result: any) {
        if (result) {
          if (AWS.config.credentials === null) {
            const IdentityPoolId = getIdentityPoolId();
            const cognitoLoginId = getCognitoLoginId();
            AWS.config.region = "eu-west-2";
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: IdentityPoolId,
              Logins: {
                [cognitoLoginId]: result.getIdToken().getJwtToken()
              }
            });
          }
          if (AWS.config.credentials instanceof Credentials) {
            AWS.config.credentials.get(function() {
              fileUpdate.forEach(update => {
                s3.upload(
                  {
                    Key: `${props.match.params.id}/${update.id}`,
                    Body: update.file,
                    Bucket
                  },
                  {},
                  function(err: any) {
                    console.log(err);
                  }
                );
              });
            });
          }
        }
      });
    }
  };

  const UPDATE_FILES_ON_COLLECTION = gql`
    mutation UpdateFilesOnCollection(
      $collectionId: ID
      $files: [TdrCollectionFilesInput]
    ) {
      updateFilesOnCollection(collectionId: $collectionId, files: $files) {
        files {
          id
        }
      }
    }
  `;

  const onUpload: (
    updateFunction: MutationFn<{}, IUpdateFileInput>
  ) => void = updateFunction => {
    updateFunction({
      variables: {
        collectionId: props.match.params.id ? props.match.params.id : "",
        files: fileUpdate.map(({ file, ...rest }) => rest)
      }
    });
    upload();
  };

  return (
    <Page title="Upload file" path={props.location.pathname}>
      <Mutation<{}, IUpdateFileInput> mutation={UPDATE_FILES_ON_COLLECTION}>
        {updateFilesOnCollection => (
          <>
            <div className="govuk-grid-row">
              <FileInfoTable fileUpdate={fileUpdate} isLoading={isLoading} />
              <FileUploadArea
                onFilesProcessed={onFilesProcessed}
                setIsLoading={setIsLoading}
              />
            </div>

            <div className="govuk-grid-row">
              <Button
                text="Upload"
                onClick={() => onUpload(updateFilesOnCollection)}
              />
            </div>
          </>
        )}
      </Mutation>
    </Page>
  );
};

export { Upload };
