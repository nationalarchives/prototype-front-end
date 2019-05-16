import * as React from "react";
import { generateHash } from "../utils";
import { IFileInfo, IWebkitEntry, IReader } from "../utils/files";
import { IUpdateFile } from "./Upload";
import uuid4 from "uuid";

interface IFileUploadAreaProps {
  onFilesProcessed: (fileInfo: IUpdateFile[]) => void;
  setIsLoading: React.Dispatch<boolean>;
}

const FileUploadArea: React.FunctionComponent<IFileUploadAreaProps> = props => {
  const [dataTransferItems, setDataTransferItems]: [
    IWebkitEntry[],
    React.Dispatch<IWebkitEntry[]>
  ] = React.useState<IWebkitEntry[]>([]);

  // eslint-disable-next-line
  React.useEffect(() => {
    async function getFiles() {
      if (dataTransferItems.length !== 0) {
        let allFileInfo: IFileInfo[] = [];
        for (const item of dataTransferItems) {
          const allFiles: IFileInfo[] = await getAllFiles(item, []);
          allFileInfo = allFileInfo.concat(allFiles);
        }

        const updateFiles: IUpdateFile[] = allFileInfo.map(fileInfo => ({
          id: uuid4(),
          checksum: fileInfo.shaHash,
          size: fileInfo.file.size.toString(),
          path: fileInfo.entry.fullPath,
          lastModifiedDate: fileInfo.file.lastModified.toString(),
          file: fileInfo.file
        }));
        props.onFilesProcessed(updateFiles);
        props.setIsLoading(false);
      }
    }
    getFiles();
    setDataTransferItems([]);
  });

  const [isDragging, setIsDragging]: [
    boolean,
    React.Dispatch<boolean>
  ] = React.useState<boolean>(false);

  const getFileFromEntry: (entry: IWebkitEntry) => Promise<File> = entry => {
    return new Promise<File>(resolve => {
      entry.file(f => {
        resolve(f);
      });
    });
  };

  const getEntriesFromReader: (
    reader: IReader
  ) => Promise<IWebkitEntry[]> = reader => {
    return new Promise<IWebkitEntry[]>(resolve => {
      reader.readEntries(entries => {
        resolve(entries);
      });
    });
  };

  const getAllFiles: (
    entry: IWebkitEntry,
    fileInfoInput: IFileInfo[]
  ) => Promise<IFileInfo[]> = async (entry, fileInfoInput) => {
    const reader: IReader = entry.createReader();
    const entries: IWebkitEntry[] = await getEntriesFromReader(reader);
    for (const entry of entries) {
      if (entry.isDirectory) {
        await getAllFiles(entry, fileInfoInput);
      } else {
        fileInfoInput.push({
          entry: entry,
          file: await getFileFromEntry(entry),
          shaHash: await generateHash(await getFileFromEntry(entry))
        });
      }
    }
    return fileInfoInput;
  };

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

  return (
    <div
      id="fileDrop"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{ backgroundColor: isDragging ? "lightgrey" : "grey" }}
    >
      Drop files ...
    </div>
  );
};

export { FileUploadArea };
