import * as React from "react";
import AWS from "aws-sdk";
import { getCurrentUser } from "../utils";
import { Header } from "./Header";
import { IFileInfo } from "../utils/files";
import { FileUploadArea } from "./FileUploadArea";
import { FileInfoTable } from "./FileInfoTable";
import { RouteComponentProps } from "react-router";
import { makeAuthenticatedRequest } from "../utils/user";

interface IUploadProps {
  id?: string;
}

const Upload: React.FunctionComponent<
  RouteComponentProps<IUploadProps>
> = props => {
  console.log(props.match.params.id);
  const [isLoading, setIsLoading]: [
    boolean,
    React.Dispatch<boolean>
  ] = React.useState<boolean>(false);

  const [fileInfo, setFileInfo]: [
    IFileInfo[],
    React.Dispatch<IFileInfo[]>
  ] = React.useState<IFileInfo[]>([]);

  const onFilesProcessed: (
    fileInfoInput: IFileInfo[]
  ) => void = fileInfoInput => {
    if (JSON.stringify(fileInfoInput) !== JSON.stringify(fileInfo)) {
      setFileInfo(fileInfoInput);
      setIsLoading(false);
    }
  };

  const upload: () => void = () => {
    var albumBucketName = "tna-tdr-files";
    const uploadToS3: () => void = () => {
      var s3: AWS.S3 = new AWS.S3({
        params: { Bucket: albumBucketName }
      });

      s3.upload(
        {
          Key: "test2.txt",
          Body: fileInfo[0].file,
          Bucket: "tna-tdr-files"
        },
        {},
        function(err: any) {
          console.log(err);
        }
      );
    };
    makeAuthenticatedRequest(uploadToS3);
  };

  return (
    <div>
      <Header signedIn={getCurrentUser() !== null} text={"Upload"} {...props} />
      <FileInfoTable fileInfo={fileInfo} isLoading={isLoading} />
      <FileUploadArea
        onFilesProcessed={onFilesProcessed}
        setIsLoading={setIsLoading}
      />
      <button onClick={upload}>Upload</button>
    </div>
  );
};

export { Upload };
