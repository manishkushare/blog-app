import { Route, Switch } from "react-router-dom";
import React from "react";
import Header from "./Header";
import Home from "./Home";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Article from "./Article";
import { USER_TOKEN_KEY, USER_VERIFY_URL } from "../utils/constants";
import Loader from "./verifyUser";
import NoMatch from "./NoMatch";

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      user: null,
      isLoggedIn: false,
      isVerifying: true,
    };
  }
  async componentDidMount() {
    let token = localStorage.getItem(USER_TOKEN_KEY);
    try {
      if (token) {
        let user = await fetch(USER_VERIFY_URL, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (user.ok) {
          user = await user.json();
          console.log({ user }, ".....");
          return this.persistUser(user.user);
        } else {
          user = await user.json();
          user = await Promise.reject(user);
          return user;
        }
      }
    } catch (error) {
      this.setState({ isVerifying: false });
    }
  }
  persistUser = (user) => {
    localStorage.setItem(USER_TOKEN_KEY, user.token);
    this.setState({
      user,
      isLoggedIn: true,
      isVerifying: false,
    });
  };
  render() {
    const { user, isLoggedIn, isVerifying } = this.state;
    if (isVerifying) {
      return <Loader />;
    }
    return isLoggedIn ? (
      <AuthorizedComponents user={user} isLoggedIn={isLoggedIn} />
    ) : (
      <UnAuthorizedComponents
        user={user}
        isLoggedIn={isLoggedIn}
        persistUser={this.persistUser}
      />
    );
  }
}
function AuthorizedComponents(props) {
  return (
    <>
      <Header user={props.user} isLoggedIn={props.isLoggedIn} />
      <Switch>
        <Route path="/" exact>
          <Home user={props.user} isLoggedIn={props.isLoggedIn} />
        </Route>
        <Route path="/articles/:slug" component={Article}></Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </>
  );
}
function UnAuthorizedComponents(props) {
  return (
    <>
      <Header user={props.user} isLoggedIn={props.isLoggedIn} />
      <Switch>
        <Route path="/" exact>
          <Home user={props.user} isLoggedIn={props.isLoggedIn} />
        </Route>
        <Route path="/register">
          <SignUp persistUser={props.persistUser} />
        </Route>
        <Route path="/login">
          <SignIn persistUser={props.persistUser} />
        </Route>
        <Route path="/articles/:slug" component={Article}></Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </>
  );
}

export default App;
