import * as React from "react";
import { IFileInfo } from "../utils/files";
import uuid4 from "uuid";

interface IFileInfoTableProps {
  fileInfo: IFileInfo[];
  isLoading: boolean;
}

const FileInfoTable: React.FunctionComponent<IFileInfoTableProps> = props => {
  const { fileInfo, isLoading } = props;
  return (
    <>
      {(fileInfo.length > 0 || isLoading) && (
        <div id="fileInformation" key={uuid4()}>
          <span>{"Filename"}</span>
          <span>{"Checksum"}</span>
          <span>{"Path"}</span>
          <span>{"Size"}</span>
        </div>
      )}
      {isLoading && <div>Loading...</div>}
      <div id="fileProgressList">
        {fileInfo.map(info => {
          return (
            <div id="fileInformation" key={uuid4()}>
              <span>{info.file.name}</span>
              <span>{!info.shaHash || "done ✔"}</span>
              <span>{info.entry.fullPath}</span>
              <span>{info.file.size}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export { FileInfoTable };
