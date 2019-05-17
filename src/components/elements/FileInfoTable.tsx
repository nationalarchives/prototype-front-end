import * as React from "react";
import { IUpdateFile } from "../pages/Upload";

interface IFileInfoTableProps {
  fileUpdate: IUpdateFile[];
  isLoading: boolean;
}

const FileInfoTable: React.FunctionComponent<IFileInfoTableProps> = props => {
  const { fileUpdate } = props;
  return (
    <table className="govuk-table">
      <caption className="govuk-table__caption">File Information</caption>
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th className="govuk-table__header" scope="col">
            File Name
          </th>
          <th className="govuk-table__header" scope="col">
            Checksum
          </th>
          <th className="govuk-table__header" scope="col">
            Path
          </th>
          <th className="govuk-table__header" scope="col">
            Size
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {fileUpdate.map(file => {
          return (
            <tr className="govuk-table__row" key={file.id}>
              <td className="govuk-table__cell">{file.file.name}</td>
              <td className="govuk-table__cell">
                {!file.checksum || "done ✔"}
              </td>
              <td className="govuk-table__cell">{file.path}</td>
              <td className="govuk-table__cell">{file.size}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export { FileInfoTable };
