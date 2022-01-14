function ProfileNav(props) {
  const activeTab = props.activeTab;
  return (
    <ul className="article_nav flex padding-lr-2rem">
      <li onClick={props.removeTab} className={activeTab || "active-articles-nav"}>Your Articles</li>
      <li onClick={()=>props.addTab("Favorited Articles")} className={activeTab === "Favorited Articles" ? "active-articles-nav":""} >Favorited Articles</li>
      
    </ul>
  )
}
export default ProfileNav;