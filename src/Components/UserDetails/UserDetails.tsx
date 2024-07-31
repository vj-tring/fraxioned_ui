import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './UserDetails.css'
import userImage from '../../assets/profile.jpeg'
import EditIcon from '../../assets/edit-icon.png'
import { ApiUrl } from '../../Components/config'

interface Document {
  title: string
  dateUploaded: string
  content: string
}

const UserDetails: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    id: 0,
    name: '',
    email: '',
    phone: '',
    address1: '',
    secondaryEmail: '',
    secondaryPhone: '',
  })

  const [documents] = useState<Document[]>([
    {
      title: 'Signing Doc',
      dateUploaded: '1/23/2024',
      content: require('../../assets/ownerPortal.pdf'),
    },
    {
      title: 'Property Summary',
      dateUploaded: '1/23/2024',
      content: require('../../assets/ownerPortal1.pdf'),
    },
    {
      title: 'Welcome Packet',
      dateUploaded: '1/23/2024',
      content: require('../../assets/ownerPortal2.pdf'),
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      const userDataObject = JSON.parse(userData)
      const localStorageId = userDataObject.id

      fetch(`${ApiUrl}/users/user/${localStorageId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setUserDetails({
              id: data.id,
              email: data.email,
              name: data.username,
              phone: data.phone,
              address1: data.address1,
              secondaryEmail: data.secondaryEmail,
              secondaryPhone: data.secondaryPhone,
            })
            console.log('User details:', data)
          } else {
            console.error('No matching user found')
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error)
        })
    } else {
      console.error('No user data found in local storage')
    }
  }, [])

  const handleViewDocument = (content: string) => {
    window.open(content, '_blank')
  }

  return (
    <div className="user-details-container">
      <div className="user-header">
        <img src={userImage} alt="User" className="user-image" />
        <div className="name">
          <h5>{userDetails.name}</h5>
          <h6 className="userEmail">{userDetails.email}</h6>
        </div>
        <div className="edit-icon">
          <img className="edit" src={EditIcon} alt="Edit" />
        </div>
      </div>
      <div className="user-info">
        <div className="info-box ">
          <p>
            <strong>EMAIL</strong>
            <br />
            {userDetails.email}
          </p>
          <p>
            <strong>PHONE</strong>
            <br />
            {userDetails.phone}
          </p>
          <p>
            <strong>MAILING ADDRESS</strong>
            <br />
            {userDetails.address1}
          </p>
        </div>
       
        <div className="info-box secondary-info">
          <p>
            <strong>SECONDARY EMAIL</strong>
            <br />
            {userDetails.secondaryEmail}
          </p>
          <p className="SecPhone">
            <strong>SECONDARY PHONE</strong>
            <br />
            {userDetails.secondaryPhone}
          </p>
        </div>
      </div>

      <div className="user-document mt-4">
        <h3 className="mb-4">MY DOCUMENTS</h3>
        <table className="table table-bordered user-table">
          <thead className="thead-light">
            <tr>
              <th scope="col">TITLE</th>
              <th scope="col">DATE UPLOADED</th>
              <th scope="col" className="document">
                DOCUMENT
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index}>
                <td>{doc.title}</td>
                <td>{doc.dateUploaded}</td>
                <td>
                  {doc.content.endsWith('.pdf') ? (
                    <div className="document">
                      <button
                        className="btn btn-primary View-btn mr-2"
                        onClick={() => handleViewDocument(doc.content)}
                      >
                        View
                      </button>
                      <a
                        href={doc.content}
                        download
                        className="btn btn-secondary download-btn"
                      >
                        Download
                      </a>
                    </div>
                  ) : (
                    <p>{doc.content}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserDetails
