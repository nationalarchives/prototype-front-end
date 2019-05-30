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
  getFilesStatus: IViewFiles;
}

const GET_FILES_STATUS = gql`
  query GetFilesStatus($collectionId: ID!) {
    getFilesStatus(collectionId: $collectionId) {
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
    <Page title="View files" path={props.location.pathname}>
      <Query<IViewFilesData, IViewFilesProps>
        query={GET_FILES_STATUS}
        variables={{ collectionId: props.match.params.collectionId }}
      >
        {({ loading, error, data }) => {
          if (loading) return <div>Loading</div>;
          if (error) return <div>{error.message}</div>;
          if (data)
            return (
              <>
                <h1 className="app-task-list">{data.getFilesStatus.name}</h1>
                {data.getFilesStatus.files.map(file => {
                  return (
                    <ol className="app-task-list">
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
