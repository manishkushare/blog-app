import React from "react";
import { PROFILE_URL } from "../utils/constants";
import Profile from "./Profile";
class UserProfile extends React.Component{
  constructor(props) {
    super();
    this.state = {
      profile : null,
    }
  }
  fetch = async () => {
    const username = this.props.match.params.username;
    
    try {
      let profile = await fetch(PROFILE_URL+ username);
      if (profile.ok) {
        profile = await profile.json();
        console.log(profile);
        return this.setState({profile: profile.profile});
      } else {
        profile = await profile.json();
        profile = await Promise.reject(profile);
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  async componentDidMount() {
    await this.fetch();
  }
  render() {
    const { profile } = this.state;
    console.log(profile,"profile");
    return (
      // this.props.children(profile)
      <Profile user={profile} />
    )
  }
}
export default UserProfile;