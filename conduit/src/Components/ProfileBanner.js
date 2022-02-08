import React from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";

function ProfileBanner(props) {
  const { profile } = props;
  const userInfo = React.useContext(UserContext);
  return (
    <section className="user_profile_banner">
      <div className="container flex flex-col align-item-center">
        <div className="user_profile_img_wrapper flex">
          <img src={profile.image} alt="" />
        </div>
        <h2>{profile.username || ""}</h2>
        <p>{profile.bio || ""}</p>
        <div className="user_profile_settings">
          {(profile.email === userInfo.user.email || profile.username=== userInfo.user.username) ? (
            <Link to="/settings">
              <button>Edit Settings</button>
            </Link>
          ) : profile.following ? (
            
              <button onClick={()=>props.handleUnfollow()}>Unfollow User</button>
            
          ) : (
            
              <button onClick={()=>props.handleFollow()} >Follow User</button>
            
          )}
        </div>
      </div>
    </section>
  );
}
export default ProfileBanner;
