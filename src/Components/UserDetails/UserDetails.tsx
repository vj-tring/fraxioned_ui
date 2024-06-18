import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserDetails.css';
import userImage from '../../assets/profile.jpeg';

interface UserDetailsProps {
  name: string;
  email: string;
  phone: string;
  mailingAddress: string;
  secondaryEmail: string;
  secondaryPhone: string;
}

const UserDetails: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetailsProps>({
    name: '',
    email: '',
    phone: '',
    mailingAddress: '',
    secondaryEmail: '',
    secondaryPhone: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userDataObject = JSON.parse(userData);
      setUserDetails({
        email: userDataObject.email,
        name: userDataObject.username,
        phone: '(123) 456-7890',
        mailingAddress: '123 Main Street, Salt Lake City, UT. 84101',
        secondaryEmail: 'jane.doe@example.com',
        secondaryPhone: '(123) 555-5555',
      });
    } else {
      const userFromLocalStorage = localStorage.getItem('userDetails');
      if (userFromLocalStorage) {
        const userDetailsData = JSON.parse(userFromLocalStorage);
        setUserDetails(userDetailsData);
      }
    }
  }, []);

  return (
    <div className="user-details-container">
      <div className="user-header">
        <img src={userImage} alt="User" className="user-image" />
        <div className="name">
          <h5>{userDetails.name}</h5>
          <h6>& {userDetails.email}</h6>
        </div>
        <div className="edit-icon">Edit</div>
      </div>
      <div className="user-info">
        <div className="info-box email-phone">
          <p><strong>EMAIL</strong><br />{userDetails.email}</p>
          <p><strong>PHONE</strong><br />{userDetails.phone}</p>
        </div>
        <div className="info-box">
          <p><strong>MAILING ADDRESS</strong><br />{userDetails.mailingAddress}</p>
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