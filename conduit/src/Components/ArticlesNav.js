import React from "react";
import UserContext from "./UserContext";
function ArticlesNav(props) {
  const userInfo = React.useContext(UserContext);
  console.log(userInfo);
  const activeTab = props.activeTab;
  return (
    
    <ul className="article_nav flex padding-lr-2rem">
      {
        userInfo.isLoggedIn && <li  onClick={()=> props.addTab('yourfeeds')} className={activeTab === "yourfeeds"? "active-articles-nav":null}>Your Feeds</li>
      }
      <li onClick={props.removeTab} className={activeTab || "active-articles-nav"}>Global</li>
      {
        activeTab  && activeTab!=="yourfeeds"&& <li className={activeTab && "active-articles-nav margin-l-1"}>#{activeTab}</li>
      }
    </ul>
  );
}
export default ArticlesNav;
