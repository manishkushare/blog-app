import React from "react";
import { TAGS_LIST_URL } from "../utils/constants";
import Loader from "./Loader";
class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagsList: null,
      error: null,
    };
  }
  async componentDidMount() {
    try {
      let tagsList = await fetch(TAGS_LIST_URL);
      if (!tagsList.ok) {
        throw Error(tagsList.statusText);
      }
      tagsList = await tagsList.json();
      this.setState({ tagsList });
      
    } catch (error) {
      this.setState({ error: "Not able to fetch tags" });
    }
  }
  render() {
    const { error } = this.state;
    const tagsList = this.state.tagsList;
    const activeTab = this.props.activeTab;
    if (error) {
      return <h2>{error}</h2>
    }
    if (!tagsList) {
      return <Loader />
    }
    return (
      <ul className="tag-lists flex flex-wrap flex-start">
        {tagsList.tags.map((tag, index) => {
          return (
            <li onClick={()=> this.props.addTab(tag)}  key={tag} className="tag">
              {tag}
            </li>
          );
        })}
      </ul>
    );
  }
}
export default Tags;
