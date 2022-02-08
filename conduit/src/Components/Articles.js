import { Link } from "react-router-dom";
import moment from "moment";
function Articles(props) {
  if (props.articles.length === 0 ) {
    return (
      <ul className="feeds-list">
        <li>No Articles found</li>
      </ul>
    )
  }
  function handleClick(slug, favorited) {
    if (favorited) {
      return props.unFavoriteArticle(slug);
    } else {
      return props.favoriteArticle(slug);
    }
  }
  return (

    <ul className="feeds-list">
      {props.articles.map((article, index) => {
        // console.log(article);
        return (
          <li key={index} className="article">
            <div className="row_one">
              <Link to={`/profile/${article.author.username}`}>
                <div className="author-info-wrapper">
                  <div className="author_img_wrapper">
                    <img src={article.author.image} alt="" />
                  </div>
                  <div className="author-info">
                    <h2>{article.author.username}</h2>
                    <span>{moment(article.createdAt).format("YYYY/MM/DD")}</span>
                  </div>
                </div>
              </Link>
              <div
                onClick={()=> handleClick(article.slug,article.favorited)}
                className={article.favorited?"liked likes":"unliked likes"}
              >
                <i className="fas fa-heart"></i>
                <p>{article.favoritesCount}</p>
              </div>
            </div>
            <div className="row_two">
              <h2>{article.title}</h2>
              <p>{article.body.slice(0,100)}</p>
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
  );
}
export default Articles;
