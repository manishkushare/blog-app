// import { render } from "@testing-library/react";
import { Link } from "react-router-dom";
import React from "react";
class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
    };
    this.baseURL = "https://mighty-oasis-08080.herokuapp.com/api/";
  }
  componentDidMount() {
    const slug = this.props.match.params.slug;
    fetch(this.baseURL + `articles/${slug}`)
      .then((res) => res.json())
      .then((article) => this.setState({ article: article.article }));
  }
  render() {
    const { article } = this.state;
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
