function Tags(props) {
  // console.log(props);
  function handleClick({target}) {
    const value = target.innerText;
    props.handleTag(value);
  }
  return (
    <ul className="tag-lists flex flex-wrap flex-start">
      {
        props.tags.map((tag, index) => {
          return (
            <li onClick={handleClick} key={tag} className="tag">
              {tag}
            </li>
          )
        })
      }
    </ul>
  )
}
export default Tags;