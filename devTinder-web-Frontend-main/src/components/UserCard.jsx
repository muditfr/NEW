import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";
import ReportUser from "./ReportUser";

const UserCard = ({user}) => {
  const { _id,firstName, lastName, photoUrl, age , gender, about } = user;
  const dispatch = useDispatch();
  const [showReportModal, setShowReportModal] = useState(false);

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status+ "/" + userId , {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    }
    catch (err) {
      console.error("Error sending request:", err);
    }
  }

  const handleReportSuccess = () => {
    alert('Report submitted successfully. Our admin team will review it.');
  };



  return (
    <>
      <div className="card bg-base-300 w-96 shadow-sm">
        <figure>
          <img
            src={user.photoUrl}
            alt="photo" />
        </figure>
        <div className="card-body">
          <div className="flex justify-between items-start">
            <h2 className="card-title">{firstName + " " + lastName}</h2>
            <button 
              className="btn btn-ghost btn-sm text-gray-500"
              onClick={() => setShowReportModal(true)}
              title="Report User"
            >
              ⚠️
            </button>
          </div>
          {age && gender && <p>{age + " ," + gender}</p>}
          <p>{about}</p>
          <div className="card-actions justify-center my-4">
            <button 
              className="btn btn-primary" 
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>

      {showReportModal && (
        <ReportUser
          reportedUser={user}
          onClose={() => setShowReportModal(false)}
          onSuccess={handleReportSuccess}
        />
      )}
    </>
  );
};

export default UserCard;