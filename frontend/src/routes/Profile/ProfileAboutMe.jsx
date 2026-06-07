import { useOutletContext } from "react-router-dom";

function ProfileAboutMe() {
  const { profile } = useOutletContext();

  return (
    <div className="about-me-section">
      {profile?.bio ? (
        <p className="about-me-text" style={{ fontSize: '1.2rem', lineHeight: '1.8', padding: '2rem 0' }}>
          {profile.bio}
        </p>
      ) : (
        <p className="about-me-text text-muted" style={{ padding: '2rem 0' }}>
          This user has not added a bio yet.
        </p>
      )}
    </div>
  );
}

export default ProfileAboutMe;