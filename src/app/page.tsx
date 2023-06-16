import {
  LoginButton,
  LogoutButton,
  ProfileButton,
  RegisterButton,
  RoomButton,
} from "@/components/buttons.component";
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { User } from '@/components/user.component';

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {

  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <main>
      <div>
        <LoginButton />
        <User/>
        <RoomButton />
      </div>
    </main>
  )
}
