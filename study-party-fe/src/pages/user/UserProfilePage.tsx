import useAuthStore from "@/store/auth/authStore.ts";

const UserProfilePage = () => {
    const { user } = useAuthStore();

    return (
        <div className="user-profile-page">
            <h1>{user?.email}</h1>
            <p>{user?.avatar_url || 'null'}</p>
            <p>{user?.display_name || 'null'}</p>
            <p>{user?.role}</p>
            <p>{user?.verified === true ? 'da verified' : 'chua verified'}</p>
        </div>
    )
}

export default UserProfilePage;