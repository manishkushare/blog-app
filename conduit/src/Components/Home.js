import React from "react";
import Articles from "./Articles";
import Tags from "./Tags";
import Banner from "./Banner";
import Pagination from "./Pagination";
import ArticlesNav from "./ArticlesNav";
import { ARTICLES_URL } from "../utils/constants";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: null,
      error : null,
      offset: 0,
      activePage: 1,
      articleCount: null,
      articlesPerPage: 10,
      activeTab: "",
    };

  }
  addTab = (tab) => {
    this.setState({ activeTab: tab, offset: 0 ,activePage :1});
  };
  removeTab = () => {
    this.setState({ activeTab: "" });
  }
  fetchData = async () => {
    const { articlesPerPage, offset, activeTab, articles } = this.state;
    try {
      let articles = await fetch(
        ARTICLES_URL + `?limit=${articlesPerPage}&offset=${offset}` + (activeTab && ((activeTab !== "yourfeeds" && `&tag=${activeTab} `)||(activeTab === "yourfeeds" && `&author=${this.props.user.username}` )))
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
  componentDidMount() {
    console.log("componentDidMount");
    this.fetchData();
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
  componentDidUpdate(prevProps, prevState) {
    if (prevState.activePage !== this.state.activePage || (prevState.activeTab !== this.state.activeTab)) {
      console.log("componentDidUpdate");
      this.fetchData();
      
    }
  }
  render() {
    
    const {
      activePage,
      articles,
      articlesPerPage,
      articleCount,
      activeTab,
    } = this.state;
    const { user, isLoggedIn } = this.props;
    return (
      <>
        <Banner />
        <section className="home-content">
          <div className="container home-content-wrapper">
            <section className="feeds">
              <ArticlesNav activeTab={activeTab} removeTab={this.removeTab} addTab={this.addTab}  user={user} isLoggedIn={isLoggedIn} />
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
            <aside className="tags">
              <Tags addTab={this.addTab} />
            </aside>
          </div>
        </section>
      </>
    );
  }
}
export default Home;

