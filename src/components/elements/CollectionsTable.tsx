import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";

export interface ICollection {
  id: string;
  name: string;
  closure: string;
  copyright: string;
  legalStatus: string;
}

interface ICollectionsTableProps {
  collections: ICollection[];
  onLoadMore: (done: () => void) => void;
}

const CollectionsTable: React.FunctionComponent<
  ICollectionsTableProps
> = props => {
  const { collections } = props;
  const [allLoaded, setAllLoaded]: [
    boolean,
    React.Dispatch<boolean>
  ] = React.useState<boolean>(false);

  const done: () => void = () => {
    setAllLoaded(true);
  };
  return (
    <table className="govuk-table">
      <caption className="govuk-table__caption">File Information</caption>
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th className="govuk-table__header" scope="col">
            Collection Name
          </th>
          <th className="govuk-table__header" scope="col">
            Closure
          </th>
          <th className="govuk-table__header" scope="col">
            Copyright
          </th>
          <th className="govuk-table__header" scope="col">
            Legal Status
          </th>
          <th className="govuk-table__header" scope="col">
            Files
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {(collections || []).map(collection => {
          return (
            <tr className="govuk-table__row" key={collection.id}>
              <td className="govuk-table__cell">{collection.name}</td>
              <td className="govuk-table__cell">{collection.closure}</td>
              <td className="govuk-table__cell">{collection.copyright}</td>
              <td className="govuk-table__cell">{collection.legalStatus}</td>
              <td className="govuk-table__cell">
                <Link to={`/files/${collection.id}`}>View Files</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td>
            {!allLoaded && (
              <Button text="Load More" onClick={() => props.onLoadMore(done)} />
            )}
            {allLoaded && <span>All Results Loaded</span>}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export { CollectionsTable };
