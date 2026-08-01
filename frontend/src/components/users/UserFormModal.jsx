import { useEffect, useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  UserPlus,
  Save,
} from "lucide-react";

const UserFormModal = ({
  isOpen,
  onClose,
  onSave,
  user,
  loading,
}) => {
  const isEditMode = Boolean(user);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "USER",
    is_active: true,
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",

        // Existing passwords cannot be retrieved.
        // Keep this empty unless the admin enters
        // a new password.
        password: "",

        // These are used only in create mode.
        role: user.role || "USER",
        is_active:
          user.is_active ?? true,
      });
    } else {
      setFormData({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "USER",
        is_active: true,
      });
    }

    setErrors({});
    setShowPassword(false);
  }, [user, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username =
        "Username is required.";
    }

    if (
      !isEditMode &&
      !formData.password
    ) {
      newErrors.password =
        "Password is required.";
    }

    if (
      formData.password &&
      formData.password.length < 8
    ) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
      Create mode:
      Send password, role and is_active.

      Edit mode:
      Send only editable user fields.
      Password is included only when the
      admin entered a new password.
    */

    const payload = {
      username:
        formData.username.trim(),

      first_name:
        formData.first_name.trim(),

      last_name:
        formData.last_name.trim(),

      email:
        formData.email.trim(),
    };

    if (isEditMode) {
      if (formData.password.trim()) {
        payload.password =
          formData.password;
      }
    } else {
      payload.password =
        formData.password;

      payload.role =
        formData.role;

      payload.is_active =
        formData.is_active;
    }

    try {
      await onSave(
        payload,
        isEditMode
      );
    } catch (error) {
      console.error(
        "User form error:",
        error
      );
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/50
        backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          w-full max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}

        <div
          className="
            sticky top-0 z-10
            flex items-center
            justify-between
            border-b
            border-slate-100
            bg-white
            px-7 py-5
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-blue-950
              "
            >
              {isEditMode
                ? "Edit User"
                : "Create New User"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {isEditMode
                ? "Update user details or set a new password."
                : "Create a new account and assign its role."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              p-2
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
              disabled:cursor-not-allowed
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-7"
        >
          <div
            className="
              grid grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >
            {/* Username */}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-blue-950
                "
              >
                Username
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <input
                type="text"
                name="username"
                value={
                  formData.username
                }
                onChange={
                  handleChange
                }
                placeholder="Enter username"
                className={`
                  w-full rounded-xl
                  border px-4 py-3
                  outline-none
                  transition
                  focus:ring-2
                  focus:ring-blue-200
                  ${
                    errors.username
                      ? "border-red-400"
                      : "border-slate-200 focus:border-blue-600"
                  }
                `}
              />

              {errors.username && (
                <p
                  className="
                    mt-1
                    text-xs
                    text-red-500
                  "
                >
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-blue-950
                "
              >
                Email
                <span
                  className="
                    ml-1
                    italic
                    font-normal
                    text-slate-400
                  "
                >
                  (Optional)
                </span>
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="Enter email"
                className="
                  w-full rounded-xl
                  border border-slate-200
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-blue-600
                  focus:ring-2
                  focus:ring-blue-200
                "
              />
            </div>

            {/* First name */}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-blue-950
                "
              >
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                value={
                  formData.first_name
                }
                onChange={
                  handleChange
                }
                placeholder="Enter first name"
                className="
                  w-full rounded-xl
                  border border-slate-200
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-blue-600
                  focus:ring-2
                  focus:ring-blue-200
                "
              />
            </div>

            {/* Last name */}

            <div>
              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-blue-950
                "
              >
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                value={
                  formData.last_name
                }
                onChange={
                  handleChange
                }
                placeholder="Enter last name"
                className="
                  w-full rounded-xl
                  border border-slate-200
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-blue-600
                  focus:ring-2
                  focus:ring-blue-200
                "
              />
            </div>

            {/* Password */}

            <div
              className="
                md:col-span-2
              "
            >
              <div
                className="
                  mb-2
                  flex items-center
                  justify-between
                "
              >
                <label
                  className="
                    text-sm font-semibold
                    text-blue-950
                  "
                >
                  Password

                  {!isEditMode && (
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  )}
                </label>

                {isEditMode && (
                  <span
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Leave empty to keep the
                    current password
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    isEditMode
                      ? "Enter a new password only if you want to change it"
                      : "Enter password"
                  }
                  className={`
                    w-full rounded-xl
                    border
                    px-4 py-3
                    pr-12
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-blue-200
                    ${
                      errors.password
                        ? "border-red-400"
                        : "border-slate-200 focus:border-blue-600"
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    transition
                    hover:text-blue-700
                  "
                >
                  {showPassword
                    ? (
                      <EyeOff
                        size={20}
                      />
                    )
                    : (
                      <Eye
                        size={20}
                      />
                    )}
                </button>
              </div>

              {errors.password && (
                <p
                  className="
                    mt-1
                    text-xs
                    text-red-500
                  "
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Create-only fields */}

            {!isEditMode && (
              <>
                {/* Role */}

                <div>
                  <label
                    className="
                      mb-2 block
                      text-sm font-semibold
                      text-blue-950
                    "
                  >
                    Role
                  </label>

                  <select
                    name="role"
                    value={
                      formData.role
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      w-full rounded-xl
                      border border-slate-200
                      bg-white
                      px-4 py-3
                      outline-none
                      transition
                      focus:border-blue-600
                      focus:ring-2
                      focus:ring-blue-200
                    "
                  >
                    <option value="USER">
                      User
                    </option>

                    <option value="ADMIN">
                      Admin
                    </option>
                  </select>
                </div>

                {/* Active */}

                <div
                  className="
                    flex items-end
                  "
                >
                  <label
                    className="
                      flex w-full
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-slate-200
                      px-4 py-3
                    "
                  >
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={
                        formData.is_active
                      }
                      onChange={
                        handleChange
                      }
                      className="
                        h-4 w-4
                        accent-blue-700
                      "
                    />

                    <div>
                      <p
                        className="
                          text-sm
                          font-semibold
                          text-blue-950
                        "
                      >
                        Active Account
                      </p>

                      <p
                        className="
                          text-xs
                          text-slate-500
                        "
                      >
                        Allow the user to
                        sign in immediately
                      </p>
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Buttons */}

          <div
            className="
              mt-8
              flex justify-end
              gap-3
              border-t
              border-slate-100
              pt-6
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                rounded-xl
                border border-slate-200
                px-6 py-3
                font-medium
                text-slate-600
                transition
                hover:bg-slate-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex items-center
                gap-2
                rounded-xl
                bg-blue-700
                px-6 py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-800
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isEditMode
                ? (
                  <Save size={18} />
                )
                : (
                  <UserPlus
                    size={18}
                  />
                )}

              {loading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;