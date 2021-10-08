import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import LoginView from "./Components/LoginView";
import RegisterView from "./Components/RegisterView";
import { PageContainer } from "./Components/PageContainer";
import { routerPaths } from "./helpers/routerPaths";
import { useCurrentUser } from "./helpers/hooks";
import { useEffect } from "react";
<<<<<<< HEAD
import AddExpenseIncome from "./Components/AddExpenseIncome";
import EditExpense from "./Components/EditExpense";
=======
>>>>>>> main

function App() {
  const currentUser = useCurrentUser();
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
<<<<<<< HEAD
        <Route exact path="/add">
          <AddExpenseIncome />
        </Route>

        <Route exact path="/edit">
          <EditExpense />
        </Route>
=======
>>>>>>> main
        <h1>No such page 😭</h1>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
