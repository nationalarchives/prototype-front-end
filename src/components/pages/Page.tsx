import * as React from "react";
import { Header } from "../elements/Header";
import { Footer } from "../elements/Footer";

interface IPageProps {
  title: string;
}
const Page: React.FunctionComponent<IPageProps> = props => {
  return (
    <>
      <Header />
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h1 className="govuk-heading-l">{props.title}</h1>
              {props.children}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export { Page };
