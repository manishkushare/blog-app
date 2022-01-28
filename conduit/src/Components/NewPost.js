import React from "react";
import react from "react";
import { ARTICLES_URL } from "../utils/constants";
import { withRouter } from "react-router-dom";
import UserContext from "./UserContext";
class NewPost extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super();
    this.state = {
      title: "",
      description: "",
      body: "",
      tagList: "",
      errors: {
        title: "",
        description: "",
        body: "",
        tags: "",
        error: "",
      },
    };
    
    
  }
  fetchArticle = async () => {
    try {
      let article = await fetch(
        ARTICLES_URL + `/${this.props.match.params.slug}`
      );
      if (article.ok) {
        article = await article.json();
        article = article.article;
        let { title, description, body, tagList } = article;
        this.setState({
          title,
          description,
          body,
          tagList,
        });
      } else {
        article = await article.json();
        article = await Promise.reject(article);
        return article;
      }
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {
    // this.token = this.context;
    if (this.props.match.params.slug) {
      this.fetchArticle();
    }
  }
  validatefields = (input) => {
    return input ? true : false;
  };

  handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;
    let errors = this.state.errors;
    switch (name) {
      case "title":
        errors.title = this.validatefields(value)
          ? ""
          : "title cannot be empty";
        break;
      case "description":
        errors.description = this.validatefields(value)
          ? ""
          : "Description cannot be empty";
        break;
      case "body":
        errors.body = this.validatefields(value) ? "" : "Body cannot be empty";
        break;
      case "tagList":
        errors.tags = this.validatefields(value)
          ? ""
          : "tag list cannot be empty";
        break;
    }
    if (name === "tagList") {
      value = value.split(",");
    }
    this.setState({
      [name]: value,
      errors,
    });
  };
  handleDisable = () => {
    return this.state.title &&
      this.state.description &&
      this.state.body &&
      this.state.tagList &&
      !this.state.errors.title &&
      !this.state.errors.body &&
      !this.state.errors.description &&
      !this.state.errors.tags
      ? false
      : true;
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, body, description, tagList } = this.state;
    try {
      let article = null;
      if (this.props.match.params.slug) {
         article = await fetch(ARTICLES_URL+`/${this.props.match.params.slug}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${this.context.user.token}`,
          },
          body: JSON.stringify({
            article: {
              title,
              body,
              description,
              tagList,
            },
          }),
        });
        
      } else {
        article = await fetch(ARTICLES_URL, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${this.context.user.token}`,
          },
          body: JSON.stringify({
            article: {
              title,
              body,
              description,
              tagList,
            },
          }),
        });
      }
      console.log(article, "post article");
      console.dir(article, "post article");
      if (article.ok) {
        if (this.props.match.params.slug) {
          return this.props.history.push(`/articles/${this.props.match.params.slug}`);

        }
        return this.props.history.push("/");
      } else {
        article = await article.json();
        article = await Promise.reject(article);
        return article;
      }
    } catch ({ errors }) {
      console.log(errors);
      return this.setState((prevState) => {
        return {
          ...prevState,
          errors: {
            ...prevState.errors,
            error: "Something went wrong !!!!",
          },
        };
      });
    }
  };
  render() {
    const { title, description, body, tagList } = this.state;
    const { errors } = this.state;
    return (
      <section className="newpost">
        <div className="container flex justify-center  ">
          <form
            action={ARTICLES_URL}
            method="post"
            className="newpost_form flex flex-col w-80"
            onSubmit={this.handleSubmit}
          >
            {errors.error ? <span>{errors.err}</span> : null}
            <input
              type="text"
              name="title"
              placeholder="Article Title"
              value={title}
              onChange={this.handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.title ? <span>{errors.title}</span> : null}
            <input
              type="text"
              name="description"
              placeholder="What's this artilce is about?"
              value={description}
              onChange={this.handleChange}
              className={errors.description ? "error" : ""}
            />
            {errors.description ? <span>{errors.description}</span> : null}
            <textarea
              name="body"
              placeholder="Write your article (in markdown)"
              id=""
              cols="30"
              rows="10"
              value={body}
              onChange={this.handleChange}
              className={errors.body ? "error" : ""}
            ></textarea>
            {errors.body ? <span>{errors.body}</span> : null}
            <input
              type="text"
              name="tagList"
              placeholder="Enter tags"
              value={tagList}
              onChange={this.handleChange}
              className={errors.tags ? "error" : ""}
            />
            {errors.tags ? <span>{errors.tags}</span> : null}
            <div className="flex justify-end">
              {this.props.match.params.slug ? (
                <button type="submit" disabled={this.handleDisable()}>
                  Update Article
                </button>
              ) : (
                <button type="submit" disabled={this.handleDisable()}>
                  Publish Article
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    );
  }
}
export default withRouter(NewPost);
