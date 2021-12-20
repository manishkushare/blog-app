// import { render } from "@testing-library/react";
import { Link } from "react-router-dom";
import React from "react";
import { ARTICLES_URL } from "../utils/constants";
class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
      error: null,
    };
  }
  async componentDidMount() {
    const slug = this.props.match.params.slug;
    try {
      let article = await fetch(ARTICLES_URL + `/${slug}`);
      if (!article.ok) {
        throw Error(article.statusText);
      }
      article = await article.json();
      this.setState({ article : article.article });
    } catch (error) {
      this.setState({error: `Not able to fetch Article - ${slug}`})
    }
  }
  render() {
    const { article,error } = this.state;
    if (error) {
      return (
      <div className="container">
          <h1>{error}</h1 >

        </div>
        )
    }
    if (!article) {
      return (
        <div className="container">
          <h1>Loading......</h1 >

        </div>
        )
        
    }
    return (
      <section className="single-article">
        <article className="single-article-hero">
          <div className="container ">
            <h2>{article.title}</h2>
            <div className="single-article-author-info flex flex-row inline-flex align-item-start">
              <div className="w-20">
                <img
                  className="w-100 border-circle"
                  src={article.author.image}
                  alt=""
                />
              </div>
              <div className="flex margin-lr-0_25 flex-col">
                <span>{article.author.username}</span>
                <span>{article.createdAt}</span>
              </div>
            </div>
          </div>
        </article>
        <article className="single-article-content ">
          <div className="container">
            <p>{article.body}</p>
            <ul>
              {article.tagList.map((tag) => {
                return <li key={tag}>{tag}</li>;
              })}
            </ul>
          </div>
        </article>
        <article className="single-article-comment">
          <div className="container">
            <p>
              <Link to="/register">
                <span>Sing Up</span>
              </Link>
              or
              <Link to="/login">
                <span>Sign In</span>
              </Link>
              to add comments and articles
            </p>

          </div>
        </article>
      </section>
    );
  }
}
export default Article;
