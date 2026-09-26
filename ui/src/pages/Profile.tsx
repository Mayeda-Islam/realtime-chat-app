import { useEffect, useState } from "react";

interface CurrentUser {
  id?: number;
  email?: string;
  username?: string;
  avatar?: string;
}

interface ProfileViewProps {
  currentUser: CurrentUser;
  onClose: () => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>; // 🟢 মেইন স্টেট চেঞ্জার সরাসরি পাস
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onClose,
  setCurrentUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
  });

  useEffect(() => {
    setFormData({
      username: currentUser?.username || "",
    });
    setAvatarPreview(currentUser?.avatar || "");
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // 🟢 এপিআই কল এবং লোকাল স্টোরেজ ম্যানেজমেন্ট সম্পূর্ণ এই কম্পোনেন্টের ভেতরেই থাকবে
  const handleSave = async () => {
    if (!formData.username.trim()) {
      alert("Username cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      // মাল্টিপার্ট ডেটার জন্য FormData অবজেক্ট তৈরি
      const dataToSend = new FormData();
      dataToSend.append("username", formData.username.trim());

      if (avatarFile) {
        dataToSend.append("avatar", avatarFile);
      }
      console.log(dataToSend, "dataToSend");
      const response = await fetch("http://localhost:3001/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // ⚠️ 'Content-Type' ম্যানুয়ালি সেট করবেন না, ব্রাউজার নিজে করবে
        },
        body: dataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      // ১. রেসপন্স থেকে আসা আসল ডেটা স্ট্রাকচারটি রিড করা
      const updatedData = result.data || result.user || result;

      // ২. লোকাল স্টোরেজ আপডেট (পুরোনো ডেটার সাথে নতুন ডেটা মার্জ করে)
      const oldUser = JSON.parse(localStorage.getItem("user") || "{}");
      const finalUserObject = { ...oldUser, ...updatedData };
      localStorage.setItem("user", JSON.stringify(finalUserObject));

      // ৩. পেরেন্ট রিঅ্যাক্ট স্টেটকে রি-রেন্ডার ট্রিগার করার জন্য ডেটা পুশ করা
      setCurrentUser(finalUserObject);

      alert("Profile updated successfully!");
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error: any) {
      alert(error.message || "Something went wrong while saving profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const avatarLetter = formData.username?.charAt(0).toUpperCase() || "?";

  return (

<div className="flex-1 h-full overflow-y-auto bg-surface-soft/30 font-sans">

  {/* ================= HEADER ================= */}
  {/* <div className="sticky top-0 z-20 h-20 px-8 bg-surface/90 backdrop-blur-xl border-b border-border/40 flex items-center justify-between">

    <div>
      <h2 className="text-lg font-bold text-text">
        Profile Settings
      </h2>

      <p className="text-xs text-text-muted mt-1">
        Manage your personal information
      </p>
    </div>

    <button
      onClick={onClose}
      className="
        flex items-center gap-2
        px-4 py-2
        rounded-xl
        text-sm font-semibold
        text-text-muted
        border border-border/50
        hover:bg-surface-soft
        hover:text-text
        transition-all
        cursor-pointer
      "
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>

      Back
    </button>

  </div> */}


  {/* ================= CONTENT ================= */}
  <div className="max-w-2xl mx-auto px-6 py-6">

    {/* ================= PROFILE HERO ================= */}
    <div className="bg-surface rounded-3xl border border-border/50 overflow-hidden shadow-sm">

      {/* Cover */}
      <div className="h-24 bg-linear-to-r from-primary/15 via-secondary/10 to-primary/10 relative">

        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />

      </div>


      {/* Profile Info */}
      <div className="px-8 pb-8">

        {/* Avatar */}
        <div className="flex items-end justify-between -mt-16">

          <div className="relative group">

            <div
              className="
                w-32 h-32
                rounded-full
                p-1.5
                bg-surface
                shadow-xl
              "
            >

              <div
                className="
                  relative
                  w-full h-full
                  rounded-full
                  overflow-hidden
                  bg-linear-to-br
                  from-primary/20
                  to-secondary/20
                  flex items-center justify-center
                  ring-1 ring-border/30
                "
              >

                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="
                      w-full h-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <span className="text-primary text-5xl font-black">
                    {avatarLetter}
                  </span>
                )}

                {/* Upload Overlay */}
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="
                      absolute inset-0
                      bg-black/55
                      flex flex-col
                      items-center
                      justify-center
                      text-white
                      cursor-pointer
                      opacity-0
                      group-hover:opacity-100
                      transition-all
                      duration-200
                    "
                  >

                    <svg
                      className="w-7 h-7 mb-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16.5V19a1 1 0 001 1h14a1 1 0 001-1v-2.5"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v12m0-12l-4 4m4-4l4 4"
                      />
                    </svg>

                    <span className="text-[10px] font-bold tracking-widest uppercase">
                      Change
                    </span>

                  </label>
                )}

              </div>

            </div>


            {/* Online Status */}
            <span
              className="
                absolute
                bottom-2
                right-2
                w-5 h-5
                rounded-full
                bg-green-500
                border-4
                border-surface
              "
            />

            {isEditing && (
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            )}

          </div>


          {/* Account Status */}
          <div className="mb-2">

            <span
              className="
                inline-flex
                items-center
                gap-2
                px-3 py-1.5
                rounded-full
                bg-green-500/10
                border border-green-500/20
                text-green-600
                text-xs
                font-semibold
              "
            >
              <span className="w-2 h-2 rounded-full bg-green-500" />

              Active
            </span>

          </div>

        </div>


        {/* Name */}
        <div className="mt-5">

          <h1 className="text-2xl font-extrabold text-text">
            {currentUser?.username}
          </h1>

          <p className="text-sm text-text-muted mt-1">
            {currentUser?.email}
          </p>

        </div>

      </div>

    </div>


    {/* ================= ACCOUNT INFORMATION ================= */}
    <div className="mt-2 bg-surface rounded-3xl border border-border/50 shadow-sm overflow-hidden">

      {/* Section Header */}
      <div className="px-7 py-5 border-b border-border/40">

        <h3 className="text-sm font-bold text-text">
          Account Information
        </h3>

        <p className="text-xs text-text-muted mt-1">
          Your basic account details
        </p>

      </div>


      <div className="p-7 space-y-4">

        {/* Username */}
        <div>

          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Username
          </label>

          {isEditing ? (

            <div className="relative">

              <svg
                className="
                  absolute
                  left-4 top-1/2
                  -translate-y-1/2
                  w-4 h-4
                  text-text-muted
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 20.118a7.5 7.5 0 0115 0"
                />
              </svg>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="
                  w-full
                  pl-11 pr-4
                  py-3.5
                  rounded-xl
                  bg-surface-soft
                  border border-border
                  text-sm
                  font-semibold
                  text-text
                  outline-none
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                  transition-all
                "
              />

            </div>

          ) : (

            <div
              className="
                flex items-center
                justify-between
                px-4 py-3.5
                rounded-xl
                bg-surface-soft/60
                border border-border/30
              "
            >

              <span className="text-sm font-semibold text-text">
                {currentUser?.username}
              </span>

              <svg
                className="w-4 h-4 text-text-muted/40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>

            </div>

          )}

        </div>


        {/* Email */}
        <div>

          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Email Address
          </label>

          <div
            className="
              flex items-center
              justify-between
              px-4 py-3.5
              rounded-xl
              bg-surface-soft/40
              border border-border/30
            "
          >

            <div className="flex items-center gap-3">

              <svg
                className="w-4 h-4 text-text-muted/50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7l9 6 9-6"
                />

                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />
              </svg>

              <span className="text-sm font-semibold text-text-muted">
                {currentUser?.email}
              </span>

            </div>


            {/* Locked */}
            <svg
              className="w-4 h-4 text-text-muted/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10V7a4 4 0 018 0v3"
              />
            </svg>

          </div>

          <p className="text-[11px] text-text-muted mt-2">
            Email address cannot be changed.
          </p>

        </div>

      </div>

    </div>


    {/* ================= ACTIONS ================= */}
    <div className="flex justify-end items-center gap-3 mt-6">
           <button
      onClick={onClose}
      className="
        flex items-center gap-2
        px-4 py-2
        rounded-xl
        text-sm font-semibold
        text-text-muted
        border border-border/50
        hover:bg-surface-soft
        hover:text-text
        transition-all
        cursor-pointer
      "
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>

      Back
    </button>
      {isEditing ? (
        <>

          <button
            onClick={() => {
              setIsEditing(false);
              setAvatarFile(null);
              setAvatarPreview(currentUser?.avatar || "");
            }}
            disabled={loading}
            className="
              px-5 py-2.5
              rounded-xl
              border border-border
              text-sm font-semibold
              text-text-muted
              hover:bg-surface-soft
              hover:text-text
              transition-all
              disabled:opacity-50
              cursor-pointer
            "
          >
            Cancel
          </button>


          <button
            onClick={handleSave}
            disabled={loading}
            className="
              flex items-center gap-2
              px-6 py-2.5
              rounded-xl
              bg-primary
              text-white
              text-sm font-bold
              shadow-lg
              shadow-primary/20
              hover:bg-primary/90
              active:scale-[0.98]
              transition-all
              disabled:opacity-70
              cursor-pointer
            "
          >

            {loading && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}

            {loading ? "Saving..." : "Save Changes"}

          </button>

        </>

      ) : (

        <button
          onClick={() => setIsEditing(true)}
          className="
            flex items-center gap-2
            px-6 py-2.5
            rounded-xl
            bg-primary
            text-white
            text-sm font-bold
            shadow-lg
            shadow-primary/20
            hover:bg-primary/90
            active:scale-[0.98]
            transition-all
            cursor-pointer
          "
        >

          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a2.25 2.25 0 113.182 3.182l-9.94 9.94a4.5 4.5 0 01-1.897 1.13l-2.244.673.673-2.244a4.5 4.5 0 011.13-1.897l9.409-9.096z"
            />
          </svg>

          Edit Profile

        </button>

      )}

    </div>

  </div>

</div>


  );
};