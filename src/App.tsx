import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import InputPage from './pages/InputPage/InputPage';
import Results from './pages/Results/Results';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/results" component={Results} exact />
        <Route path="/" component={InputPage} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
