import React from "react";
import ProfileNav from "./ProfileNav";
import ProfileBanner from "./ProfileBanner";
// import { addTab, removeTab } from "../utils/functions";
import { ARTICLES_URL } from "../utils/constants"
import Articles from "./Articles";
import Pagination from "./Pagination";
class Profile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      articles : null,
      favoritedArticles: null,
      offset: 0,
      articlesPerPage: 10,
      error: "",
      activeTab: "",
      articleCount: null,
      activePage :1
    }
  }
  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps,prevState) {
    const { activePage, activeTab } = this.state;
    if (prevState.activePage !== activePage || (prevState.activeTab !== activeTab)) {
      console.log("componentDidUpdate");
      this.fetchData();
      
    }
  }
  fetchData = async () => {
    const { articlesPerPage, offset, activeTab } = this.state;
    try {
      let articles = await fetch(
        ARTICLES_URL + `?limit=${articlesPerPage}&offset=${offset}` + (activeTab || `&author=${this.props.user.username}`)+ (activeTab && `&favorited=${this.props.user.username}`)
      );
      if (!articles.ok) {
        throw Error(articles.statusText);
      }
      articles = await articles.json();
      this.setState({ articles, articleCount: articles.articlesCount });
    } catch (error) {
      this.setState({ error: "Not able to fetch Articles" });
    }
  };
  addTab = (tab) => {
    this.setState({ activeTab: tab, offset: 0 ,activePage :1});
  };
  removeTab = () => {
    this.setState({ activeTab: "" });
  }
  handlePage = (pageNum) => {
    pageNum = +pageNum;
    let offset = null;
    if (pageNum > 1) {
      offset = pageNum * 10 - 10;
    }
    if (pageNum === 1) {
      offset = 0;
    }
    this.setState({
      activePage: pageNum,
      offset,
    });
  };
  render() {
    console.log(this.props);
    const { activeTab ,articleCount,articles,activePage,articlesPerPage} = this.state;
    return (
      <>
        <ProfileBanner user={this.props.user} />
        <section className="home-content">
          <div className="container ">
            <section className="p-tb-2">
              <ProfileNav activeTab={activeTab} addTab={this.addTab} removeTab={this.removeTab}/>
              {articles ? (
                <Articles
                  {...articles}
                  activePage={activePage}
                  articleCount={articleCount}
                />
              ) : (
                <h3>Loading.....</h3>
              )}
              <Pagination
                articleCount={articleCount}
                limit={articlesPerPage}
                handlePage={this.handlePage}
                activePage={activePage}
              />
            </section>
          </div>
        </section>
      </>

    )
  }
}
export default Profile;