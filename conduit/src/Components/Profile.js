import React from "react";
import ProfileNav from "./ProfileNav";
import ProfileBanner from "./ProfileBanner";
// import { addTab, removeTab } from "../utils/functions";
import { ARTICLES_URL, PROFILE_URL } from "../utils/constants";
import Articles from "./Articles";
import Pagination from "./Pagination";
import Loader from "./Loader";
import { withRouter } from "react-router-dom";
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: null,
      favoritedArticles: null,
      offset: 0,
      articlesPerPage: 10,
      error: "",
      activeTab: "",
      articleCount: null,
      activePage: 1,
      profile: null,
      params: this.props.match.params.username,
    };
  }
  componentDidMount() {
    this.fetchData();
    this.fetchProfile();
  }
  componentDidUpdate(prevProps, prevState) {
    const { activePage, activeTab } = this.state;
    if (
      prevState.activePage !== activePage ||
      prevState.activeTab !== activeTab
    ) {
      console.log("component did update", this.state.offset, this.state.activePage);
      this.fetchData();
    }
    if (prevState.params !== this.props.match.params.username) {
      console.log("component did mount");
      this.fetchData();
      this.fetchProfile();
    }
  }
  fetchProfile = async () => {
    const username = this.props.match.params.username;

    try {
      let profile = await fetch(PROFILE_URL + username, {
        method: "GET",
        headers: new Headers({
          Authorization: `Token ${this.props.user.token}`,
        }),
      });
      if (profile.ok) {
        profile = await profile.json();
        console.log(profile);
        return this.setState({
          profile: profile.profile,
          params: profile.profile.username,
        });
      } else {
        profile = await profile.json();
        profile = await Promise.reject(profile);
      }
    } catch (error) {
      console.log(error);
    }
  };
  fetchData = async () => {
    const { articlesPerPage, offset, activeTab } = this.state;
    console.log(offset,activeTab);

    try {
      let articles = await fetch(
        ARTICLES_URL +
          `?limit=${articlesPerPage}&offset=${offset}` +
          (activeTab || `&author=${this.props.match.params.username}`) +
          (activeTab && `&favorited=${this.props.match.params.username}`)
      );
      if (!articles.ok) {
        throw Error(articles.statusText);
      }
      articles = await articles.json();
      console.log(articles);
      this.setState({ articles, articleCount: articles.articlesCount });
    } catch (error) {
      this.setState({ error: "Not able to fetch Articles" });
    }
  };
  addTab = (tab) => {
    this.setState({ activeTab: tab, offset: 0, activePage: 1 });
  };
  removeTab = () => {
    this.setState({ activeTab: "" });
  };
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
  handleFollow = async () => {
    try {
      console.log("Token", this.props.user.token);
      let profile = await fetch(
        PROFILE_URL + `${this.state.params}` + "/follow",
        {
          method: "POST",
          headers: new Headers({
            Authorization: `Token ${this.props.user.token}`,
          }),
        }
      );
      if (profile.ok) {
        profile = await profile.json();
        console.log(profile);
        profile = profile.profile;
        this.setState({ profile });
      } else {
        profile = await profile.json();
        profile = await Promise.reject(profile);
        return profile;
      }
    } catch (error) {
      console.log(error);
    }
    // this.fetchData();
  };
  handleUnfollow = async () => {
    try {
      let profile = await fetch(
        PROFILE_URL + `${this.state.params}` + "/follow",
        {
          method: "DELETE",
          headers: new Headers({
            Authorization: `Token ${this.props.user.token}`,
          }),
        }
      );
      if (profile.ok) {
        profile = await profile.json();
        console.log(profile);
        profile = profile.profile;
        this.setState({ profile });
      } else {
        profile = await profile.json();
        profile = await Promise.reject(profile);
        return profile;
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const {
      activeTab,
      articleCount,
      articles,
      activePage,
      articlesPerPage,
      profile,
    } = this.state;
    if (!profile) {
      return (
        <div className="container">
          <Loader />
        </div>
      );
    }
    return (
      <>
        <ProfileBanner
          user={profile}
          loggedInUser={this.props.user}
          handleFollow={this.handleFollow}
          handleUnfollow={this.handleUnfollow}
        />
        <section className="home-content">
          <div className="container ">
            <section className="p-tb-2">
              <ProfileNav
                activeTab={activeTab}
                addTab={this.addTab}
                removeTab={this.removeTab}
              />
              {articles ? (
                <Articles
                  {...articles}
                  activePage={activePage}
                  articleCount={articleCount}
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
          </div>
        </section>
      </>
    );
  }
}
export default withRouter(Profile);
