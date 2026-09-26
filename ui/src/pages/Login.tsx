import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  password_hash: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

interface LoginResponse {
  token: string;
  user: User;
  message?: string;
}
const Login = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password_hash: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    e.preventDefault();

    setError("");
    setSuccess("");
    console.log(formData);
    if (!formData.email || !formData.password_hash) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user information
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful!");

      console.log("Login response:", data);

      // You can navigate after login
      navigate("/Chat");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Heading */}
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Brand Logo Container */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            {/* Chat Bubble Icon */}
            <svg
              className="w-9 h-9 text-surface fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 3c-4.97 0-9 3.58-9 8 0 2.04.88 3.92 2.34 5.33-.21 1.25-.8 2.45-1.78 3.35 1.78.14 3.5-.39 4.88-1.29.18.02.36.03.56.03 4.97 0 9-3.58 9-8s-4.03-8-9-8z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-primary">ChitChat</h1>

          <p className="text-text-secondary mt-2">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-lg shadow-primary/5">
          <h2 className="text-2xl font-semibold text-text mb-6">
            Welcome Back
          </h2>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full rounded-lg border border-border bg-surface-soft px-4 py-3 text-text placeholder-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Password
              </label>

              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password_hash"
                  value={formData.password_hash}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-border bg-surface-soft pl-4 pr-11 py-3 text-text placeholder-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-text-muted hover:text-text transition focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* Eye Off Icon */
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a17.9 17.9 0 013.23-4.325m3.1-2.225A9.956 9.956 0 0112 5c7 0 10 7 10 7a17.89 17.89 0 01-2.31 3.235M9.88 9.88a3 3 0 104.24 4.24M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    /* Eye Icon */
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex  justify-end">
              <button
                type="button"
                className="text-sm cursor-pointer text-primary hover:text-primary-dark transition font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-primary hover:bg-primary-dark px-4 py-3 font-semibold text-surface transition shadow-md shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Signup */}
          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-medium cursor-pointer text-primary hover:text-primary-dark transition"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;