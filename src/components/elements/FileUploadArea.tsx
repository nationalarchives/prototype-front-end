import * as React from "react";
import { IWebkitEntry } from "../../utils/files";
import { IUpdateFile } from "../pages/Upload";
import { useGetFileInfo } from "../../hooks/useGetFileInfo";

interface IFileUploadAreaProps {
  onFilesProcessed: (fileInfo: IUpdateFile[]) => void;
  setIsLoading: React.Dispatch<boolean>;
}

const FileUploadArea: React.FunctionComponent<IFileUploadAreaProps> = props => {
  const [dataTransferItems, setDataTransferItems]: [
    IWebkitEntry[],
    React.Dispatch<IWebkitEntry[]>
  ] = React.useState<IWebkitEntry[]>([]);

  const [isDragging, setIsDragging]: [
    boolean,
    React.Dispatch<boolean>
  ] = React.useState<boolean>(false);

  const onDrop: (event: React.DragEvent<HTMLDivElement>) => void = event => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    props.setIsLoading(true);

    const dataTransferItemList: IWebkitEntry[] = [];

    for (let index = 0; index < event.dataTransfer.items.length; index++) {
      const element = event.dataTransfer.items[index];
      dataTransferItemList.push(element.webkitGetAsEntry());
    }
    setDataTransferItems(dataTransferItemList);
  };

  const onDragOver: (
    event: React.DragEvent<HTMLDivElement>
  ) => void = event => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave: () => void = () => {
    setIsDragging(false);
  };
  const files: IUpdateFile[] = useGetFileInfo(dataTransferItems);
  if (files.length > 0) {
    props.onFilesProcessed(files);
  }

  return (
    <div
      className={`govuk-file-drop${isDragging ? "-drag" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      Drop files ...
    </div>
  );
};

export { FileUploadArea };
