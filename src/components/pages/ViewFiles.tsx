import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Page } from "./Page";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { TaskListItem } from "../elements/TaskListItem";

interface IViewFilesProps {
  collectionId?: string;
}

interface IFileStatus {
  fileName: string;
  virusScanComplete: boolean;
  checksumCheckComplete: boolean;
  fileFormatCheckComplete: boolean;
}

interface IViewFiles {
  name: string;
  files: IFileStatus[];
}

interface IViewFilesData {
  getFileStatus: IViewFiles;
}

const GET_FILE_STATUS = gql`
  query GetFileStatus($collectionId: ID) {
    getFileStatus(collectionId: $collectionId) {
      name
      files {
        fileName
        virusScanComplete
        checksumCheckComplete
        fileFormatCheckComplete
      }
    }
  }
`;

const ViewFiles: React.FunctionComponent<
  RouteComponentProps<IViewFilesProps>
> = props => {
  return (
    <Page title="View files">
      <Query<IViewFilesData, IViewFilesProps>
        query={GET_FILE_STATUS}
        variables={{ collectionId: props.match.params.collectionId }}
      >
        {({ loading, error, data }) => {
          if (loading) return <div>Loading</div>;
          if (error) return <div>{error.message}</div>;
          if (data)
            return (
              <>
                <h1 className="app-task-list">{data.getFileStatus.name}</h1>
                {data.getFileStatus.files.map(file => {
                  return (
                    <ol className="appTaskList">
                      <li>
                        <h2 className="app-task-list__section">
                          {file.fileName}
                        </h2>
                        <TaskListItem
                          title="Virus Check"
                          completed={file.virusScanComplete}
                        />
                        <TaskListItem
                          title="Checksum Check"
                          completed={file.checksumCheckComplete}
                        />
                        <TaskListItem
                          title="File Format Check"
                          completed={file.fileFormatCheckComplete}
                        />
                      </li>
                    </ol>
                  );
                })}
              </>
            );
        }}
      </Query>
    </Page>
  );
};

export { ViewFiles };
