// import { render } from "@testing-library/react";
import { Link, withRouter } from "react-router-dom";
import React from "react";
import { ARTICLES_URL } from "../utils/constants";
import UserContext from "./UserContext";
class Article extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      article: null,
      error: null,
      comment: "",
      comments: null,
      commentError: null,
    };
  }
  fetchComment = async () => {
    const slug = this.props.match.params.slug;

    try {
      let comments = await fetch(ARTICLES_URL + `/${slug}/comments`);
      if (comments.ok) {
        comments = await comments.json();
        console.log(comments, "comments");
        this.setState({
          comments: comments.comments
        })
      } else {
        comments = await comments.json();
        comments = await Promise.reject(comments);
        return comments;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async componentDidMount() {
    const slug = this.props.match.params.slug;
    try {
      let article = await fetch(ARTICLES_URL + `/${slug}`);
      if (!article.ok) {
        throw Error(article.statusText);
      }
      article = await article.json();
      let comments = await fetch(ARTICLES_URL + `/${slug}/comments`);
      if (comments.ok) {
        comments = await comments.json();
        console.log(comments, "comments");
        this.setState({
          comments:comments.comments
        })
      } else {
        comments = await comments.json();
        comments = await Promise.reject(comments);
        return comments;
      }
      this.setState({ article: article.article });
    } catch (error) {
      this.setState({ error: `Not able to fetch Article - ${slug}` });
    }
  }
  componentDidUpdate(prevProps,prevState) {
    if (prevState.comment !== this.state.comment) {
      this.fetchComment();
    }
  }
  handleDelete = async (slug) => {
    try {
      let article = await fetch(ARTICLES_URL + `/${slug}`, {
        method: "DELETE",
        headers: new Headers({
          Authorization: `Token ${this.context.user.token}`,
        }),
      });
      if (article.ok) {
        // article = await article.json();
        return await this.props.history.push("/");
      } else {
        article = await article.json();
        article = await Promise.reject(article);
        return article;
      }
    } catch (error) {
      console.log(error);
    }
  };
  handleChange = ({ target }) => {
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const { comment } = this.state;
    try {
      let postComment = await fetch(
        ARTICLES_URL + `/${this.props.match.params.slug}/comments`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization : `Token ${this.context.user.token}`
          },
          body: JSON.stringify({
            comment: {
              body: comment,
            },
          }),
        }
      );
      if (postComment.ok) {
        postComment = await postComment.json();
        return this.fetchComment();
      } else {
        postComment = await postComment.json();
        postComment = await Promise.reject(postComment);
        return postComment;
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const { article, error, comments, comment } = this.state;
    console.log(this.props);
    const {user,isLoggedIn} = this.context;
    if (error) {
      return (
        <div className="container">
          <h1>{error}</h1>
        </div>
      );
    }
    if (!article) {
      return (
        <div className="container">
          <h1>Loading......</h1>
        </div>
      );
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
            {isLoggedIn &&
              user.username === article.author.username && (
                <ul>
                  <Link to={`/editpost/${article.slug}`}>
                    <li>
                      <button>Edit Article</button>
                    </li>
                  </Link>

                  <li>
                    <button onClick={() => this.handleDelete(article.slug)}>
                      Delete Article
                    </button>
                  </li>
                </ul>
              )}
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
          {isLoggedIn ? (
            <div className="container">
              <div className="comment_section_wrapper flex flex-col ">
                <form
                  action={`${ARTICLES_URL}`+`/${this.props.match.params.slug}/comments`}
                  method="POST"
                  onSubmit={this.handleSubmit}
                  
                >
                  <textarea
                    name="comment"
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Add comment"
                    className="w-100"
                    value={comment}
                    onChange={this.handleChange}
                  ></textarea>
                  <div className="flex space-between align-item-start p-t-1 gray_bg">
                    <span className="">
                      <img src={user.image} alt="" />
                    </span>

                    <button type="submit">
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>
              <div className="comments_display_section">
                
                {
                  (comments && comments.length >= 1) ?
                    <ul>
                      {
                        comments.map((comment, index) => {
                          if (index <= 5) {
                            return (
                              <li key={index}>
                                {
                                  comment.body
                                }
                              </li>

                            )
                          }
                        })
                      }
                    </ul>
                    : <span>No comments yet</span>
                }
              </div>
            </div>
          ) : (
            <div className="container flex justify-center ">
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
          )}
        </article>
      </section>
    );
  }
}
export default withRouter(Article);
