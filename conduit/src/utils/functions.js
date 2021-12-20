// const fetchData = async () => {
//   const { articlesPerPage, offset } = this.state;
//   try {
//     let articles = await fetch(ARTICLES_URL + `?limit=${articlesPerPage}&offset=${offset}`);
//     if (!articles.ok) {
//       throw Error(articles.statusText);
//     }
//     articles = await articles.json();
//     console.log(articles, "articles");
//     this.setState({ articles, articleCount : articles.articlesCount });
//   } catch (error) {
//     this.setState({error: "Not able to fetch Articles"})
//   }
// }
// export { fetchData };