function ArticlesNav(props) {
  const activeTab = props.activeTab;
  return (
    
    <ul className="flex pading-lr-2rem">
      <li onClick={props.removeTab} className={activeTab || "active-articles-nav"}>Global</li>
      {
        activeTab && <li className={activeTab && "active-articles-nav margin-l-1"}>#{activeTab}</li>
      }
    </ul>
  );
}
export default ArticlesNav;
