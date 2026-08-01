import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Remove the error for the field currently being edited
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));

    // Remove backend error when the user starts typing again
    setLoginError("");
  };

  const handleLogin = async (event) => {
    // Prevent the browser from submitting the form
    event.preventDefault();

    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    // Stop if frontend validation fails
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      setLoginError("");

      const response = await api.post(
        "accounts/login/",
        {
          username: formData.username.trim(),
          password: formData.password,
        }
      );

      // Store JWT tokens
      localStorage.setItem(
        "access",
        response.data.access
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );

      // Store logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Navigate only after successful login
      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      const responseData = error.response?.data;

      // Simple JWT normally returns the error in "detail"
      const backendMessage =
        responseData?.detail ||
        responseData?.error ||
        responseData?.message;

      if (
        backendMessage ===
        "No active account found with the given credentials"
      ) {
        setLoginError(
          "Invalid username or password."
        );
      } else {
        setLoginError(
          backendMessage ||
          "Unable to sign in. Please try again."
        );
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-blue-50
        via-slate-50
        to-indigo-100
        px-4
        py-8
      "
    >
      <section
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-7
          shadow-xl
          sm:p-10
        "
      >
        {/* Heading */}

        <div className="mb-8 text-center">

          <div
            className="
              mx-auto
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-blue-700
              shadow-lg
              shadow-blue-200
            "
          >
            <FaUser
              className="
                text-2xl
                text-white
              "
            />
          </div>

          <h1
            className="
              text-3xl
              font-bold
              text-blue-950
            "
          >
            Welcome Back
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Sign in to access the
            Sakthi Textiles system.
          </p>

        </div>

        {/* Login form */}

        <form
          onSubmit={handleLogin}
          noValidate
          className="
            space-y-5
          "
        >

          {/* Backend login error */}

          {loginError && (

            <div
              role="alert"
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-center
                text-sm
                font-medium
                text-red-600
              "
            >
              {loginError}
            </div>

          )}

          {/* Username */}

          <div>

            <label
              htmlFor="username"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Username
            </label>

            <div
              className={`
                flex
                items-center
                rounded-xl
                border
                bg-white
                px-4
                transition
                focus-within:ring-4
                ${
                  errors.username
                    ? `
                      border-red-400
                      focus-within:border-red-500
                      focus-within:ring-red-100
                    `
                    : `
                      border-slate-300
                      focus-within:border-blue-600
                      focus-within:ring-blue-100
                    `
                }
              `}
            >

              <FaUser
                className="
                  shrink-0
                  text-slate-400
                "
              />

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                disabled={isLoading}
                className="
                  h-12
                  w-full
                  bg-transparent
                  pl-3
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                  disabled:cursor-not-allowed
                "
              />

            </div>

            {errors.username && (

              <p
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-red-600
                "
              >
                {errors.username}
              </p>

            )}

          </div>

          {/* Password */}

          <div>

            <label
              htmlFor="password"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Password
            </label>

            <div
              className={`
                flex
                items-center
                rounded-xl
                border
                bg-white
                px-4
                transition
                focus-within:ring-4
                ${
                  errors.password
                    ? `
                      border-red-400
                      focus-within:border-red-500
                      focus-within:ring-red-100
                    `
                    : `
                      border-slate-300
                      focus-within:border-blue-600
                      focus-within:ring-blue-100
                    `
                }
              `}
            >

              <FaLock
                className="
                  shrink-0
                  text-slate-400
                "
              />

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={isLoading}
                className="
                  h-12
                  w-full
                  bg-transparent
                  pl-3
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                  disabled:cursor-not-allowed
                "
              />

            </div>

            {errors.password && (

              <p
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-red-600
                "
              >
                {errors.password}
              </p>

            )}

          </div>

          {/* Submit button */}

          <button
            type="submit"
            disabled={isLoading}
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              rounded-xl
              bg-blue-700
              font-semibold
              text-white
              shadow-lg
              shadow-blue-200
              transition
              hover:bg-blue-800
              hover:shadow-xl
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isLoading
              ? "Signing in..."
              : "Sign In"
            }
          </button>

        </form>

      </section>
    </main>
  );
};

export default Login;