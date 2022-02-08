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
import NewPost from "./NewPost";
import Settings from "./Settings";
import Profile from "./Profile";
import UserProfile from "./UserProfile";
import ErrorBoundary from "./ErrorBoundary";
import UserContext from "./UserContext";
// import WithUser
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
          }

        });
        if (user.ok) {
          user = await user.json();
          return this.persistUser(user.user);
        } else {
          user = await user.json();
          user = await Promise.reject(user);
          return user;
        }
      }
      else {
        await Promise.reject("not found");
      }
    } catch (error) {
      this.setState({ isVerifying: false });
    }
  }
  componentDidUpdate() {
  }
  persistUser = (user) => {
    localStorage.setItem(USER_TOKEN_KEY, user.token);
    this.setState({
      user,
      isLoggedIn: true,
      isVerifying: false,
    });
  };
  logOutUser = () => {
    localStorage.clear();
    this.setState({
      user: null,
      isLoggedIn: false,
      isVerifying : false

    })
  }
  render() {
    const { user, isLoggedIn, isVerifying } = this.state;
    if (isVerifying) {
      return <Loader />;
    }
    return isLoggedIn ? (
      <UserContext.Provider value={{user:user,isLoggedIn:isLoggedIn,persistUser:this.persistUser,logOutUser:this.logOutUser}} >

        <AuthorizedComponents user={user} isLoggedIn={isLoggedIn} persistUser={this.persistUser} logOutUser={this.logOutUser}/>
      </UserContext.Provider>
    ) : (
      <UserContext.Provider value={{user:user,isLoggedIn:isLoggedIn,persistUser:this.persistUser,logOutUser:this.logOutUser}} >
        <UnAuthorizedComponents
          user={user}
          isLoggedIn={isLoggedIn}
          persistUser={this.persistUser}
        />

      </UserContext.Provider>
    );
  }
}
function AuthorizedComponents(props) {
  return (
    <>
      <ErrorBoundary>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/articles/:slug" exact>
            <Article />
          </Route>
          <Route path="/newpost">
            <NewPost />
          </Route>
          <Route path="/editpost/:slug">
            <NewPost />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>

          <Route path="/profile/:username" exact>
            <Profile />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </ErrorBoundary>
    </>
  );
}
function UnAuthorizedComponents(props) {
  return (
    <>
    <ErrorBoundary>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Home  />
        </Route>
        <Route path="/register">
          <SignUp  />
        </Route>
        <Route path="/login">
          <SignIn  />
        </Route>
        <Route path="/articles/:slug" component={Article}></Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>

    </ErrorBoundary>
    </>
  );
}

export default App;
