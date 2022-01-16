import { Link } from "react-router-dom";
function ProfileBanner(props) {
  const { user, loggedInUser } = props;
  return (
    <section className="user_profile_banner">
      <div className="container flex flex-col align-item-center">
        <div className="user_profile_img_wrapper flex">
          <img src={user.image} alt="" />
        </div>
        <h2>{user.username || ""}</h2>
        <p>{user.bio || ""}</p>
        <div className="user_profile_settings">
          {(user.email === loggedInUser.email || user.username=== loggedInUser.username) ? (
            <Link to="/settings">
              <button>Edit Settings</button>
            </Link>
          ) : user.following ? (
            
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
