import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Article from "./Article";
function App() {
  return (
    <>
      <Header />

      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/register">
        <SignUp />
      </Route>
      <Route path="/login">
        <SignIn />
      </Route>
      <Route path="/articles/:slug" component={Article}></Route>
    </>
  );
}

export default App;
