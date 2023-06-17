"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export const LoginButton = () => {
    return(
        <button onClick={() => signIn() }>
            Sign In
        </button>
    );
};

export const RegisterButton = () => {
    return (
        <Link href="/register">
            Register
        </Link>
    );
};

export const LogoutButton = () => {
    return(
        <button onClick={ () => signOut() }>
            Sign Out
        </button>
    );
};

export const ProfileButton = () => {
    return <Link href="/profile">Profile</Link>
};

export const RoomButton = () => {
  return <Link href="/rooms">Rooms</Link>;
};