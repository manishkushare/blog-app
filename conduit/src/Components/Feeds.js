import { Link } from "react-router-dom";
function Feeds(props) {
  console.log(props, "inside articles");
  const paginationCount = Math.ceil(props.articleCount / props.limit);
  console.log(paginationCount, "paginationCount");
  function createPaginationArray() {
    let arr = [];
    for (let i = 1; i <= paginationCount; i++) {
      arr.push(i);
    }
    return arr;
  }
  function handleClick({ target }) {
    const pageNumber = target.innerText;
    console.log(pageNumber, "pageNumber");
    props.handlePage(pageNumber);
  }
  function handleGlobal() {
    return props.loadGlobal();
  }
  return (
    <>
      {props.tag ? (
        <ul className="flex pading-lr-2rem">
          <li onClick={handleGlobal}>Global</li>
          <li className="active-articles-nav">#{props.tag}</li>
        </ul>
      ) : (
        <ul className="flex pading-lr-2rem">
          <li className="active-articles-nav">Global</li>
        </ul>
      )}

      <ul className="feeds-list">
        {props.articles.map((article, index) => {
          return (
            <li key={index} className="article">
              <div className="row_one">
                <div className="author-info-wrapper">
                  <div className="author_img_wrapper">
                    <img src={article.author.image} alt="" />
                  </div>
                  <div className="author-info">
                    <h2>{article.author.username}</h2>
                    <span>{article.createdAt}</span>
                  </div>
                </div>
                <div className="likes">
                  <i className="fas fa-heart"></i>
                  <p>{article.favoritesCount}</p>
                </div>
              </div>
              <div className="row_two">
                <h2>{article.title}</h2>
                <p>{article.body}</p>
              </div>
              <div className="row_three">
                <Link to={`/articles/${article.slug}`}>
                  <h2>Read More ....</h2>
                </Link>
                <ul>
                  {article.tagList.map((tag, index) => {
                    return <li key={tag}>{tag}</li>;
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
      <ul className="pagination flex flex-wrap ">
        {createPaginationArray().map((page) => {
          return (
            <li
              key={page}
              className={
                page === props.activePage ? "activePage" : "inActivePage"
              }
              onClick={handleClick}
            >
              {page}
            </li>
          );
        })}
      </ul>
    </>
  );
}
export default Feeds;
