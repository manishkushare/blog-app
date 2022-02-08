function Pagination(props) {
  const paginationCount = Math.ceil(props.articleCount / props.limit);
  function createPaginationArray() {
    let arr = [];
    for (let i = 1; i <= paginationCount; i++) {
      arr.push(i);
    }
    return arr;
  }
  function handleClick({ target }) {
    const pageNumber = target.innerText;
    props.handlePage(pageNumber);
  }
  return (
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
  );
}
export default Pagination;
