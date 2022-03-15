import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import SurveyView from "./views/SurveyView"
import CountResponses from "./components/Responses";
import { Container, Button } from "react-bootstrap";

function App() {
  return (
    <Router>
      <Container className="main pad-t">
        <Link to="/survey/1">
          <Button className="text-uppercase" variant="secondary" block={true}>
              Take a Survey
          </Button>
        </Link>
        <Switch>
          <Route path="/survey">
            <SurveyView surveyId={1}/>
          </Route>
        </Switch>
      </Container>
      <Container className="main pad-t">
          <Switch>
              <Route path="/responses">
                  <CountResponses/>
              </Route>
          </Switch>
      </Container>
    </Router>
  );
}

export default App;
