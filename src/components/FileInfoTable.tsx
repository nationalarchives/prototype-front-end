import * as React from "react";
import uuid4 from "uuid";
import { IUpdateFile } from "./Upload";

interface IFileInfoTableProps {
  fileUpdate: IUpdateFile[];
  isLoading: boolean;
}

const FileInfoTable: React.FunctionComponent<IFileInfoTableProps> = props => {
  const { fileUpdate, isLoading } = props;
  return (
    <>
      {(fileUpdate.length > 0 || isLoading) && (
        <div id="fileInformation" key={uuid4()}>
          <span>{"Filename"}</span>
          <span>{"Checksum"}</span>
          <span>{"Path"}</span>
          <span>{"Size"}</span>
        </div>
      )}
      {isLoading && <div>Loading...</div>}
      <div id="fileProgressList">
        {fileUpdate.map(info => {
          return (
            <div id="fileInformation" key={uuid4()}>
              <span>{info.file.name}</span>
              <span>{!info.checksum || "done ✔"}</span>
              <span>{info.path}</span>
              <span>{info.size}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export { FileInfoTable };
