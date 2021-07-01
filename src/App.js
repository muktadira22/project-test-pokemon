import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { List, Detail } from "./containers/pokemon";
import Wrapper from "@/components/wrapper";

export function App() {
  return (
    <Router>
      <Switch>
        <Wrapper>
          <Route path="/" exact component={List} />
          <Route path="/:id" exact component={Detail} />
        </Wrapper>
      </Switch>
    </Router>
  );
}
