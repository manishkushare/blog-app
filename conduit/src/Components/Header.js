import { NavLink, Link } from "react-router-dom";
function Header(props) {
  const { isLoggedIn, user } = props;
  return (
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
              <AuthenticatedHeader user={props.user} />
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
      <NavLink activeClassName="activeHeaderNav" to="/abc" exact>
        <li>New Post</li>
      </NavLink>
      <NavLink activeClassName="activeHeaderNav" to="/e" exact>
        <li>Settings</li>
      </NavLink>

      <NavLink activeClassName="activeHeaderNav" to="/l">
        <li>{props.user && props.user.username}</li>
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
