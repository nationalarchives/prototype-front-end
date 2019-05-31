import { render } from "@testing-library/react";
import * as React from "react";

import App from "../App";
describe("App", () => {
  test("App renders without crashing", () => {
    expect(render(<App />)).not.toBeNull();
  });
});
