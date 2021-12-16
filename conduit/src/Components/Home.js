import React from "react";
import Feeds from "./Feeds";
import Tags from "./Tags";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: null,
      tags: null,
      offset: 0,
      activePage: 1,
      articleCount: null,
      limit: 10,
      tag : null,
    };
    this.baseURL = 'https://mighty-oasis-08080.herokuapp.com/api/';
  }
  componentDidMount() {
    fetch(this.baseURL + `articles?limit=${this.state.limit}&offset=${this.state.offset}`)
      .then(res => res.json())
      .then(data => {
        const feeds = data;
        return fetch(this.baseURL + "tags")
          .then(res => res.json())
          .then(data => {
            const tags = data;
            return this.setState({feeds,tags,articleCount: feeds.articlesCount})
        })
      })
    
  }
  handlePage = (pageNum) => {
    pageNum = +pageNum
    let offset = null;
    if (pageNum > 1) {
      offset = (pageNum * 10) - 10;
    }
    if (pageNum === 1) {
      offset = 0;
    }
    this.setState({
      activePage: pageNum,
      offset
    })
  }
  loadGlobal = () => {
    this.setState({
      activePage: 1,
      tag :null,
      offset:0
    })
  }
  handleTag = (tag) => {
    this.setState({ tag,activePage: 1,offset:0});
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.activePage !== this.state.activePage) {
      console.log('page inside componentDidUpdate');
      fetch(this.baseURL + `articles?limit=10&offset=${this.state.offset}`)
      .then(res => res.json())
      .then(data => this.setState({feeds :data}))
      
    }
    if (prevState.tag !== this.state.tag ) {
      console.log('tag inside componentDidUpdate');

      fetch(this.baseURL + `articles?limit=10&offset=${this.state.offset}&tag=${this.state.tag}`)
      .then(res => res.json())
      .then(data => this.setState({feeds :data,articleCount: data.articlesCount}))
    }
  }
  render() {
    const feeds = this.state.feeds;
    const activePage = this.state.activePage;
    const tags = this.state.tags
    return (
      <>
        <section className="hero">
          <div className="container">
            <h2>conduit</h2>
            <p>A place to share your knowledge.</p>
          </div>
        </section>
        <section className="home-content">
          <div className="container home-content-wrapper">
            <article className="feeds">
              {
                
                this.state.feeds ? <Feeds {...feeds} loadGlobal={this.loadGlobal} tag={this.state.tag} activePage={activePage} handlePage={this.handlePage} articleCount={this.state.articleCount} limit={this.state.limit} />: <h3>Loading.....</h3>
              }
            </article>
            <aside className="tags">
              {
                this.state.tags ? <Tags {...tags} handleTag={ this.handleTag}/>: <h3>Loading....</h3>
              }
            </aside>

          </div>
        </section>
      </>
    );
  }
}
export default Home;
