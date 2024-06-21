import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserDetails.css';
import userImage from '../../assets/profile.jpeg';
import EditIcon from '../../assets/edit-icon.png';
import { ApiUrl } from 'Components/config';
interface UserDetailsProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  address1: string;
  secondaryEmail: string;
  secondaryPhone: string;
}

const UserDetails: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetailsProps>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    address1: '',
    secondaryEmail: '',
    secondaryPhone: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userDataObject = JSON.parse(userData);
      const localStorageId = userDataObject.id;
      console.log("id",localStorageId);



      fetch(`${ApiUrl}/users/user/${localStorageId}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setUserDetails({
              id: data.id,
              email: data.email,
              name: data.username,
              phone: data.phone,
              address1: data.address1,
              secondaryEmail: data.secondaryEmail,
              secondaryPhone: data.secondaryPhone,
            });
            console.log('User details:', data);
          } else {
            console.error('No matching user found');
          }
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    } else {
      console.error('No user data found in local storage');
    }
  }, []);

  return (
    <div className="user-details-container">
      <div className="user-header">
        <img src={userImage} alt="User" className="user-image" />
        <div className="name">
          {/* <h5>{userDetails.email}</h5> */}
          <h6>{userDetails.email}</h6>
        </div>
        <div className="edit-icon">
          <img className='edit' src={EditIcon} alt="Edit" />
        </div>
      </div>
      <div className="user-info">
        <div className="info-box email-phone">
          <p><strong>EMAIL</strong><br />{userDetails.email}</p>
          <p><strong>PHONE</strong><br />{userDetails.phone}</p>
        </div>
        <div className="info-box">
          <p><strong>MAILING ADDRESS</strong><br />{userDetails.address1}</p>
        </div>
        <div className="info-box secondary-info">
          <p><strong>SECONDARY EMAIL</strong><br />{userDetails.secondaryEmail}</p>
          <p className='SecPhone'><strong>SECONDARY PHONE</strong><br />{userDetails.secondaryPhone}</p>
        </div>
      </div>
      <div className="user-documents">
        <h3>MY DOCUMENTS</h3>
        <table>
          <thead>
            <tr>
              <th>TITLE</th>
              <th>DATE UPLOADED</th>
              <th>DOCUMENT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Signing Doc</td>
              <td>1/23/2024</td>
              <td>nfjhjaionflklewanhio;vegwvanvionehwaiohgnvkenvaio;gneio;wanbvkjnhjiahfegowj</td>
            </tr>
            <tr>
              <td>Property Summary</td>
              <td>1/23/2024</td>
              <td>jfeoahgiohrioahgvikjwajohgiveowaovheioawhrviogewhaigiohjiofgjheiowahfgiwa</td>
            </tr>
            <tr>
              <td>Welcome Packet</td>
              <td>1/23/2024</td>
              <td>hnfioevhwaiogvhioawhgrioiwaidhviohagioehgwaiohvwoiahhivwahviewha</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetails;