function ProfileNav(props) {
  const activeTab = props.activeTab;
  return (
    <ul className="article_nav flex padding-lr-2rem">
      <li onClick={()=> props.addTab('yourArticles')} className={activeTab ==="yourArticles"?  "active-articles-nav":""}>Your Articles</li>
      <li onClick={()=>props.addTab("favoritedArticles")} className={activeTab === "favoritedArticles" ? "active-articles-nav":""} >Favorited Articles</li>
      
    </ul>
  )
}
export default ProfileNav;