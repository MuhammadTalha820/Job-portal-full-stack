import React from 'react';
import OtherUserCard from './OtherUserCard';
import useGetOtherUsers from "@/hooks/userGetOtherUsers";
import { useSelector } from 'react-redux';

const OtherUsers = () => {
    useGetOtherUsers();

    const getUser = useSelector(store => store.auth.getUser);

    if (!getUser || !Array.isArray(getUser)) {
        return <p className="text-center mt-4 text-gray-700">Loading users...</p>;
    }

    return (
        <div className="flex flex-col gap-y-4 p-4">
            {getUser.map((user) => (
                <OtherUserCard key={user._id} user={user} />
            ))}
        </div>
    );
};

export default OtherUsers;
