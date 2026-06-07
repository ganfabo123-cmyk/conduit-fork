import { useEffect, useState } from "react";
import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";
import AuthorInfo from "../../components/AuthorInfo";
import ContainerRow from "../../components/ContainerRow";
import NavItem from "../../components/NavItem";
import getProfile from "../../services/getProfile";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { state } = useLocation();
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const headers = currentUser?.token ? { Authorization: `Token ${currentUser.token}` } : {};
        const fetchedProfile = await getProfile({ headers, username });
        if (!fetchedProfile) {
          navigate("/not-found", { replace: true });
          return;
        }
        setProfile(fetchedProfile);
      } catch (error) {
        navigate("/not-found", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username, currentUser, navigate]);

  if (isLoading) {
    return <div className="container">Loading profile...</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <ContainerRow>
          <AuthorInfo profile={profile} />
        </ContainerRow>
      </div>

      <ContainerRow>
        <div className="col-xs-12 col-md-10 offset-md-1">
          <div className="articles-toggle">
            <ul className="nav nav-pills outline-active">
              <NavItem text="About Me" url="about-me" state={state} />
              <NavItem text="My Articles" url="my-articles" state={state} />
              <NavItem text="Favorited Articles" url="favorites" state={state} />
            </ul>
          </div>
          <Outlet context={{ profile }} />
        </div>
      </ContainerRow>
    </div>
  );
}

export default Profile;