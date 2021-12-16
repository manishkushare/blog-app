import { NavLink,Link } from "react-router-dom";
function Header() {
  return (
    <header className="header">
      <div className="container header-wrapper">
        <Link to="/">
          <h1>conduit</h1>
        </Link>
        <nav className="nav">
          <ul className="nav-list">
            <NavLink activeClassName="activeHeaderNav" to="/" exact>
              <li>
                Home
              </li>
            </NavLink>
            <NavLink activeClassName="activeHeaderNav" to="/register">
              <li>
                Sign Up
              </li>
            </NavLink>
            <NavLink activeClassName="activeHeaderNav" to="/login">
              <li>
                Sign In
              </li>
            </NavLink>
          </ul>
        </nav>
      </div>
    </header>
  )
}
export default Header;