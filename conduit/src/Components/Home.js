import React from "react";
import Articles from "./Articles";
import Tags from "./Tags";
import Banner from "./Banner";
import Pagination from "./Pagination";
import ArticlesNav from "./ArticlesNav";
import { ARTICLES_URL, ARTICLES_FEEDS_URL } from "../utils/constants";
import Loader from "./Loader";
import UserContext from "./UserContext";
class Home extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      articles: null,
      error: null,
      offset: 0,
      activePage: 1,
      articleCount: null,
      articlesPerPage: 10,
      activeTab: "",
    };
  }
  
  addTab = (tab) => {
    this.setState({ activeTab: tab, offset: 0, activePage: 1 });
  };
  removeTab = () => {
    this.setState({ activeTab: "" });
  };
  
  fetchData = async () => {
    const { articlesPerPage, offset, activeTab } = this.state;
    try {
      let articles = null;
      if (activeTab && activeTab === "yourfeeds") {
        console.log("inside if");
        articles = await fetch(ARTICLES_FEEDS_URL+
          `?limit=${articlesPerPage}&offset=${offset}` +
            (activeTab && `&tag=${activeTab} `), {
          method: "GET",
          headers: new Headers({
            Authorization: `Token ${this.context.user.token}`
          })
        });
      } else  {
        articles = this.context.user && this.context.user.token ?(
          await fetch(ARTICLES_URL+
            `?limit=${articlesPerPage}&offset=${offset}` +
              (activeTab && `&tag=${activeTab} `)
             , 
             {
            method: "GET",
            headers: new Headers({
              Authorization: `Token ${this.context.user.token}`,
            }),
          }) 
          
        ) :
          await fetch(
          ARTICLES_URL +
            `?limit=${articlesPerPage}&offset=${offset}` +
            (activeTab && `&tag=${activeTab} `)
        );
      }

      if (!articles.ok) {
        throw Error(articles.statusText);
      }
    
      articles = await articles.json();
      
      console.log({articles});
      this.setState({
        articles,
        articleCount: articles.articlesCount,
        error: "",
      });
    } catch (error) {
      this.setState({ error: "Not able to fetch Articles" });
    }
  };
  componentDidMount() {
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
    if (
      prevState.activePage !== this.state.activePage ||
      prevState.activeTab !== this.state.activeTab 
      
    ) {
      console.log("componentDidUpdate");
      this.fetchData();
    }
    // if(prevState.articles !== t)
  }
  favoriteArticle = async (slug) => {
    console.log(slug);
    try {
      let article = await fetch(ARTICLES_URL + `/${slug}/` + "favorite", {
        method:"POST",
        headers: new Headers({
          Authorization: `Token ${this.context.user.token}`,
        }),
      })
      if (article.ok) {
        article = await article.json();
        console.log(article, "favorite");
        return this.fetchData();
        
      } else {
        article = await article.json();
        article = await Promise.reject(article);
        return article
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  unFavoriteArticle = async (slug) => {
    console.log(slug);
    try {
      let article = await fetch(ARTICLES_URL + `/${slug}/` + "favorite", {
        method:"DELETE",
        headers: new Headers({
          Authorization: `Token ${this.context.user.token}`,
        }),
      })
      if (article.ok) {
        article = await article.json();
        console.log(article, "unfavorite");
        await this.fetchData();
        return;
      } else {
        article = await article.json();
        article = await Promise.reject(article);
        return article
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    const {
      activePage,
      articles,
      articlesPerPage,
      articleCount,
      activeTab,
      error,
    } = this.state;
    return (
      <>
        <Banner />
        <section className="home-content">
          <div className="container home-content-wrapper">
            <section className="feeds">
              <ArticlesNav
                activeTab={activeTab}
                removeTab={this.removeTab}
                addTab={this.addTab}
                
              />
              {articles ? (
                <Articles
                  {...articles}
                  activePage={activePage}
                  articleCount={articleCount}
                  favoriteArticle={this.favoriteArticle}
                  unFavoriteArticle={this.unFavoriteArticle}
                  
                />
              ) : (
                <Loader />
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
    )
  }
}
export default Home;
