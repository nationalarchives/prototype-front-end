import * as React from "react";
import gql from "graphql-tag";
import { Page } from "./Page";
import { Query } from "react-apollo";
import { CollectionsTable, ICollection } from "../elements/CollectionsTable";
import { RouteComponentProps } from "react-router";

interface ICollectionQueryDataProps {
  getCollections: ICollection[];
}

interface ICollectionQueryVariables {
  offset: number;
  limit: number;
}

const GetCollections: React.FunctionComponent<RouteComponentProps> = props => {
  const GET_COLLECTION = gql`
    query GetCollections($offset: Int, $limit: Int) {
      getCollections(offset: $offset, limit: $limit) {
        id
        name
        copyright
        closure
        legalStatus
      }
    }
  `;

  return (
    <Page title="View Collections" path={props.location.pathname}>
      <Query<ICollectionQueryDataProps, ICollectionQueryVariables>
        query={GET_COLLECTION}
        variables={{ offset: 0, limit: 1 }}
      >
        {({ loading, error, data, fetchMore }) => {
          const getCollections: ICollection[] = data ? data.getCollections : [];
          if (loading) return <div>Loading</div>;
          if (error) return <div>{error.message}</div>;
          return (
            <>
              <CollectionsTable
                onLoadMore={done =>
                  fetchMore({
                    variables: {
                      offset: getCollections.length,
                      limit: 2
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      console.log(fetchMoreResult);
                      if (
                        !fetchMoreResult ||
                        (fetchMoreResult &&
                          !fetchMoreResult.getCollections.length)
                      ) {
                        done();
                        return prev;
                      }
                      return {
                        prev,
                        getCollections: [
                          ...prev.getCollections,
                          ...fetchMoreResult.getCollections
                        ]
                      };
                    }
                  })
                }
                collections={getCollections}
              />
            </>
          );
        }}
      </Query>
    </Page>
  );
};

export { GetCollections };
