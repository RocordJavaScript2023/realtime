import { UserDTO } from "@/lib/types/dto/user-dto";
import "@/components/css/userCard.css";

export default function UserCard({ user }: { user: UserDTO }) {

    const userImage: string = user.picture === '' ? `https://robohash.org/${user.name}` : user.picture;
    const userName: string = user.name;
    const userEmail: string = user.email;

  return (
    <div className="user-card">
        <div className="square-3">
            <div className="user-profile-picture-wrapper">
                <img className="user-profile-picture" src={userImage}/>
            </div>
            <div className="user-info-wrapper">
                <div className="user-name-wrapper">
                    <h6 className="user-name">{userName}</h6>
                </div>
                <div className="user-email-wrapper">
                    <div className="user-email">{userEmail}</div>
                </div>
            </div>
        </div>
    </div>
  );
}
