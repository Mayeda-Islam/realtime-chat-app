import { useEffect, useState } from "react";

const ProfileView = ({
  currentUser,
  onClose,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    currentUser?.avatar || ""
  );

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
  });

  useEffect(() => {
    setFormData({
      username: currentUser?.username || "",
    });

    setAvatarPreview(currentUser?.avatar || "");
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // File select
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Optional: 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setAvatarFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  };

  const handleSave = async () => {
    try {
      await onUpdate({
        username: formData.username,
        avatarFile,
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const avatarLetter =
    formData.username?.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Header */}
      <div className="h-16 px-6 border-b border-border
                      flex items-center justify-between">

        <div>
          <h2 className="font-semibold text-text">
            My Profile
          </h2>

          <p className="text-xs text-text-muted">
            Manage your account
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-2 rounded-lg
                     text-text-muted
                     hover:bg-surface-soft
                     hover:text-text transition"
        >
          ← Back
        </button>
      </div>

      {/* Profile */}
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Avatar */}
        <div className="flex flex-col items-center">

          <div className="relative">

            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-28 h-28 rounded-full
                           object-cover
                           ring-4 ring-primary/10"
              />
            ) : (
              <div
                className="w-28 h-28 rounded-full
                           bg-linear-to-br
                           from-primary/30
                           to-secondary/30
                           flex items-center justify-center
                           text-primary
                           text-4xl font-bold"
              >
                {avatarLetter}
              </div>
            )}

            {isEditing && (
              <>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0
                             w-9 h-9
                             rounded-full
                             bg-primary
                             text-white
                             flex items-center justify-center
                             cursor-pointer
                             shadow-md
                             hover:opacity-90
                             transition"
                  title="Change profile picture"
                >
                  📷
                </label>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          <h2 className="mt-4 text-xl font-bold text-text">
            {currentUser.username}
          </h2>

          <p className="text-sm text-text-muted">
            {currentUser.email}
          </p>

          <span className="mt-2 flex items-center gap-2 text-xs text-green-500">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Online
          </span>

          {isEditing && (
            <p className="mt-2 text-xs text-text-muted">
              Click the camera icon to change your photo
            </p>
          )}
        </div>

        {/* Username */}
        <div className="mt-10">
          <label className="text-sm font-medium text-text">
            Username
          </label>

          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3
                         rounded-lg
                         bg-surface-soft
                         border border-border
                         text-text
                         outline-none
                         focus:border-primary
                         focus:ring-2 focus:ring-primary/20"
            />
          ) : (
            <div className="mt-2 px-4 py-3 rounded-lg bg-surface-soft">
              {currentUser.username}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="mt-5">
          <label className="text-sm font-medium text-text">
            Email
          </label>

          <div className="mt-2 px-4 py-3 rounded-lg bg-surface-soft text-text-muted">
            {currentUser.email}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">

          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setAvatarFile(null);
                  setAvatarPreview(currentUser?.avatar || "");
                }}
                className="px-4 py-2 rounded-lg
                           border border-border
                           text-text-muted
                           hover:bg-surface-soft"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg
                           bg-primary text-white
                           hover:opacity-90"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 rounded-lg
                         bg-primary text-white
                         hover:opacity-90"
            >
              Edit Profile
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileView;