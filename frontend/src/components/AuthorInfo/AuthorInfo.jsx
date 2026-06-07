import Markdown from "markdown-to-jsx";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Avatar";
import FollowButton from "../FollowButton";

function AuthorInfo({ profile }) {
  const { username } = useParams();
  const { loggedUser } = useAuth();
  const [localProfile, setLocalProfile] = useState(profile);

  const followHandler = ({ followersCount, following }) => {
    setLocalProfile((prev) => ({ ...prev, followersCount, following }));
  };

  const displayUsername = localProfile?.username || username;
  const { bio, followersCount, following, image } = localProfile || {};

  return (
    <div className="col-xs-12 col-md-10 offset-md-1">
      <Avatar alt={displayUsername} className="user-img" src={image} />
      <h4>{displayUsername}</h4>

      {bio && <Markdown options={{ forceBlock: true }}>{bio}</Markdown>}

      {loggedUser && displayUsername === loggedUser.username ? (
        <Link
          className="btn btn-sm btn-outline-secondary action-btn"
          to="/settings"
        >
          <i className="ion-gear-a"></i> Edit Profile Settings
        </Link>
      ) : (
        <FollowButton
          followersCount={followersCount}
          following={following}
          handler={followHandler}
          username={displayUsername}
        />
      )}
    </div>
  );
}

export default AuthorInfo;