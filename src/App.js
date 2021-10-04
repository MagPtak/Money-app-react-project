import { Switch, Route, Link, BrowserRouter, Redirect } from "react-router-dom";
import LoginView from "./Components/LoginView";
// import sendToFirebase from "./sendToFirebase";
import RegisterView from "./Components/RegisterView";
import { PageContainer } from "./Components/PageContainer";
import { routerPaths } from "./helpers/routerPaths";
// import { AuthProvider } from "./Auth";
import { useCurrentUser } from "./helpers/hooks";
import { useEffect } from "react";

function App() {
  const currentUser = useCurrentUser();

  console.log(currentUser);
  useEffect(() => {
    console.log("[App] currentUser: ", currentUser);
  });

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={routerPaths.login}>
          <LoginView />
        </Route>

        <Route exact path={routerPaths.register}>
          <RegisterView />
        </Route>

        <Route exact path={routerPaths.dashboard}>
          {currentUser === null ? (
            <Redirect to={routerPaths.noAccess} />
          ) : (
            <PageContainer />
          )}
        </Route>

        <Route exact path={routerPaths.noAccess}>
          <h1>No access!</h1>
        </Route>

        <h1>No such page 😭</h1>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
