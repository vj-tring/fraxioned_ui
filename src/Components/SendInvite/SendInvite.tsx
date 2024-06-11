import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import useSendInviteHandler from  "./SendInviteApiHandler";   
import axios from 'axios';
import { PortURL } from '../config';

const SendInvite: React.FC = () => {
  const {
    handleSubmit,
    email,
    status,
    errorMessage,
    setEmail,
    selectedRole,
    setSelectedRole
  } = useSendInviteHandler();

  const [roles, setRoles] = useState<{ id: number, roleName: string }[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${PortURL}/roles`);
        setRoles(response.data);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <Form onSubmit={handleSubmit}>  
      <Form.Group controlId="formEmail">
        <Form.Control 
          type="email" 
          placeholder="Enter email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: 10, borderRadius: 3, marginTop: 20, marginBottom: 20 }}
        />
      </Form.Group>

      <Form.Group controlId="formRole">
        <Form.Control 
          as="select" 
          value={selectedRole} 
          onChange={(e) => setSelectedRole(Number(e.target.value))} 
          required 
          style={{ padding: 10, borderRadius: 3, marginTop: 20, marginBottom: 20 }}
        >
          <option value="">Select role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.roleName}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3" disabled={status === 'loading'}>
        {status === 'loading' ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Send Invite'}
      </Button>

      {status === 'success' && (
        <Alert variant="success" className="mt-3">
          Invite sent successfully!
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="danger" className="mt-3">
          {errorMessage}
        </Alert>
      )}
    </Form>
  );
};

export default SendInvite;
