import React, { useState } from 'react'
import { Modal, Image } from 'react-bootstrap'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaEdit } from 'react-icons/fa'

interface UserDetailsModalProps {
  show: boolean
  onHide: () => void
  userImage?: string
  userDetails: {
    name: string
    email: string
    phone: string
    mailingAddress: string
    secondaryEmail: string
    secondaryPhone: string
  }
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  show,
  onHide,
  userImage,
  userDetails,
}) => {
  const [newImage, setNewImage] = useState<string | undefined>(userImage)
  const [showEditIcon, setShowEditIcon] = useState(false)
  const [showFileInput, setShowFileInput] = useState(false)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          setNewImage(reader.result as string)
        }
      }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  const handleEditIconClick = () => {
    setShowFileInput(true)
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{}}>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {newImage && (
            <div
              style={{
                position: 'relative',
              }}
            >
              <Image
                src={newImage}
                roundedCircle
                height="60"
                width="60"
                className="mb-3"
                alt="User"
                onMouseOver={() => setShowEditIcon(true)}
                onMouseLeave={() => setShowEditIcon(false)}
              />
              {showEditIcon && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    cursor: 'pointer',
                  }}
                  onClick={handleEditIconClick}
                >
                  <FaEdit color="white" size="lg" />
                </span>
              )}
            </div>
          )}
          <h5>{userDetails.name}</h5>
          {showFileInput && <input type="file" onChange={handleImageChange} />}
        </div>
        <p className="">
          <strong>Email:</strong> {userDetails.name}
        </p>
        <p>
          <strong>Phone:</strong> {userDetails.phone}
        </p>
        <p>
          <strong>Mailing Address:</strong> {userDetails.mailingAddress}
        </p>
        <p>
          <strong>Secondary Email:</strong> {userDetails.secondaryEmail}
        </p>
        <p>
          <strong>Secondary Phone:</strong> {userDetails.secondaryPhone}
        </p>
      </Modal.Body>
    </Modal>
  )
}

export default UserDetailsModal
