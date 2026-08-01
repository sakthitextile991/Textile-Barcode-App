import { useMemo, useState, useEffect } from "react";

import api from "../services/api";
import DashbordLayout from "../../src/pages/DashboardLayout";
import UserStats from "../components/users/UserStats";
import UserToolbar from "../components/users/UserToolbar";
import UserTable from "../components/users/UserTable";
import UserFormModal from "../components/users/UserFormModal";
import DeleteUserModal from "../components/users/DeleteUserModal";


function UserManagement() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get(
                "accounts/users/"
            );

            const userData = Array.isArray(
                response.data
            )
                ? response.data
                : response.data.results || [];

            setUsers(userData);

        } catch (err) {

            console.error(
                "Failed to load users:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchUsers();

    }, []);


    const filteredUsers = useMemo(() => {
        return users.filter(
            (user) => {
                const searchValue = search.toLowerCase();
                const matchesSearch =
                    user.username
                        .toLowerCase()
                        .includes(searchValue)
                    ||
                    user.email
                        .toLowerCase()
                        .includes(searchValue)
                    ||
                    `${user.first_name} ${user.last_name}`
                        .toLowerCase()
                        .includes(searchValue);

                const matchesRole =
                    roleFilter === "ALL"
                    ||
                    user.role === roleFilter;

                const matchesStatus =
                    statusFilter === "ALL"
                    ||
                    (
                        statusFilter === "ACTIVE"
                        &&
                        user.is_active
                    )
                    ||
                    (
                        statusFilter === "INACTIVE"
                        &&
                        !user.is_active
                    );

                return (
                    matchesSearch
                    &&
                    matchesRole
                    &&
                    matchesStatus
                );

            }
        );

    },[
        users,
        search,
        roleFilter,
        statusFilter,
    ]);

    const statistics = {

        total: users.length,

        admins: users.filter((user) => user.role === "ADMIN").length,

        active: users.filter((user) => user.is_active).length,

        inactive:users.filter((user) =>!user.is_active).length,

    };

    const handleCreateUser = () => {

        setSelectedUser(null);
        setIsUserModalOpen(true);

    };


    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };


    
    const handleSaveUser = async (userData) => {
        try {
            setError("");
            if (selectedUser) {

                await api.patch(`accounts/users/${selectedUser.id}/`,userData)

            } else {

                await api.post("accounts/users/",userData);

            }

            await fetchUsers();

            setIsUserModalOpen(false);
            setSelectedUser(null);

        } catch (err) {

            console.error("User save failed:",err);
            const responseData =
                err.response?.data;

            if (responseData && typeof responseData === "object") {

                const firstError = Object.values(responseData)[0];
                setError(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : firstError
                );

            } else {

                setError(
                    "Unable to save user."
                );

            }

            throw err;
        }
    };

    const handleStatusChange = async (user) => {
        try {

            setError("");
            const endpoint = user.is_active ? "deactivate" : "activate";

            await api.post(`accounts/users/${user.id}/${endpoint}/`);
            await fetchUsers();

        } catch (err) {

            console.error("Status update failed:",err);

            setError(
                err.response?.data?.error
                ||
                "Unable to update user status."
            );
        }
    };

    const handleRoleChange = async (user,role) => {
        try {
            setError("");

            await api.post(`accounts/users/${user.id}/change_role/`,
                {
                    role: role
                }
            );

            await fetchUsers();

        } catch (err) {

            console.error("Role update failed:",err);
            setError(
                err.response?.data?.error
                ||
                "Unable to change user role."

            );
        }
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) {
            return;
        }
        try {
            setError("");

            await api.delete(`accounts/users/${selectedUser.id}/`);
            await fetchUsers();

            setIsDeleteModalOpen(false);
            setSelectedUser(null);

        } catch (err) {

            console.error("User deletion failed:",err);

            setError(
                err.response?.data?.error
                ||
                err.response?.data?.non_field_errors?.[0]
                ||
                "Unable to delete user."
            );
        }
    };



    return (

        <DashbordLayout>
            <main className="min-h-screen bg-slate-50p-4 sm:p-6lg:p-8">
                
                <div>

                    {/* Header */}
                    <div
                        className="
                            mb-8
                            flex
                            flex-col
                            gap-5
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >
                        <div>

                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Administration
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                User Management
                            </h1>

                            <p className=" mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base" >

                                Create user accounts,
                                manage access roles,
                                and control account status.

                            </p>

                        </div>

                        <button
                            onClick={handleCreateUser}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                px-5
                                py-3
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-blue-700
                                active:scale-[0.98]
                            "
                        >
                            <span className="text-lg">
                                +
                            </span>
                            Create User

                        </button>
                    </div>

                    {/* Statistics */}

                    <UserStats statistics={statistics} />

                    {/* User table card */}

                    <section
                        className="
                            mt-8
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >

                        <div className="border-b border-slate-200 p-5 sm:p-6" >

                            <div className="mb-5">

                                <h2 className="text-xl font-bold text-slate-900">
                                    Users
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage registered
                                    users and their
                                    permissions.
                                </p>

                            </div>


                            <UserToolbar

                                search={search}
                                setSearch={setSearch}
                                roleFilter={roleFilter}
                                setRoleFilter={setRoleFilter}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                            />

                        </div>

                        <UserTable

                            users={filteredUsers}
                            onEdit={handleEditUser}
                            onStatusChange={handleStatusChange}
                            onRoleChange={handleRoleChange}
                            onDelete={handleDeleteClick}

                        />

                    </section>

                </div>

                {/* Create/Edit modal */}

                <UserFormModal

                    isOpen={isUserModalOpen}
                    user={selectedUser}
                    onClose={() => {
                        setIsUserModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onSave={handleSaveUser}
                />

                {/* Delete modal */}

                <DeleteUserModal

                    isOpen={isDeleteModalOpen}
                    user={selectedUser}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onConfirm={handleDeleteUser}
                />

                {error && (
                    <div
                        className="
                            fixed
                            bottom-6
                            right-6
                            z-[9999]
                            flex
                            w-[380px]
                            max-w-[calc(100vw-3rem)]
                            items-start
                            gap-4
                            rounded-2xl
                            border
                            border-red-200
                            bg-white
                            p-5
                            shadow-2xl
                        "
                    >
                        {/* Error icon */}
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-red-100
                                text-xl
                                font-bold
                                text-red-600
                            "
                        >
                            !
                        </div>

                        {/* Error message */}
                        <div className="flex-1">

                            <h3
                                className="
                                    font-semibold
                                    text-red-700
                                "
                            >
                                Action Failed
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-slate-600
                                "
                            >
                                {error}
                            </p>

                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setError("")}
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-lg
                                text-slate-400
                                transition
                                hover:bg-red-50
                                hover:text-red-600
                            "
                            aria-label="Close error notification"
                        >
                            ×
                        </button>

                    </div>
                )}

            </main>

        </DashbordLayout>

    );

}


export default UserManagement;