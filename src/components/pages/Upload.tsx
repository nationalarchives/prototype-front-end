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

interface IUploadProps {
  id?: string;
}

interface IUpdateFileInfo {
  id: string;
  checksum: string;
  size: string;
  path: string;
  lastModifiedDate: string;
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
    var albumBucketName = "tna-tdr-files";
    var s3: AWS.S3 = new AWS.S3({
      params: { Bucket: albumBucketName }
    });
    const cognitoUser: CognitoUser | null = getCurrentUser();
    if (cognitoUser !== null) {
      cognitoUser.getSession(function(err: any, result: any) {
        if (result) {
          if (AWS.config.credentials instanceof Credentials) {
            AWS.config.credentials.get(function() {
              console.log("here");
              fileUpdate.forEach(update => {
                s3.upload(
                  {
                    Key: update.id,
                    Body: update.file,
                    Bucket: "tna-tdr-files"
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
    <Page title="Upload file">
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
