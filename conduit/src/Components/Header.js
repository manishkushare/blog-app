import { NavLink, Link } from "react-router-dom";
import UserContext from "./UserContext";
import React,{useContext} from "react";
function Header(props) {
  // const { isLoggedIn, user } = props;
  const userInfo = useContext(UserContext);
  const {user,isLoggedIn} = userInfo;
  console.log(user,isLoggedIn);
  return (
    // <h1>hey</h1>
    <header className="header">
      <div className="container header-wrapper">
        <Link to="/">
          <h1>conduit</h1>
          
        </Link>
        <nav className="nav">
          <ul className="nav-list">
            <NavLink activeClassName="activeHeaderNav" to="/" exact>
              <li>Home</li>
            </NavLink>
            {isLoggedIn ? (
              <AuthenticatedHeader user={user} />
            ) : (
              <PublicHeader />
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function AuthenticatedHeader(props) {
  return (
    <>
      <NavLink activeClassName="activeHeaderNav" to="/newpost" exact>
        <li>New Post</li>
      </NavLink>
      <NavLink activeClassName="activeHeaderNav" to="/settings" exact>
        <li>Settings</li>
      </NavLink>

      <NavLink activeClassName="activeHeaderNav" to={`/profile/${props.user.username}`}>
        <li className=" flex ">
          <div className="profile-wrapper flex ">
            <img src={props.user.image} alt="" />

          </div>
          <span>
            {props.user && props.user.username}

          </span>
        </li>
      </NavLink>
    </>
  );
}

function PublicHeader() {
  return (
    <>
      <NavLink activeClassName="activeHeaderNav" to="/register">
        <li>Sign Up</li>
      </NavLink>
      <NavLink activeClassName="activeHeaderNav" to="/login">
        <li>Sign In</li>
      </NavLink>
    </>
  );
}
export default Header;
