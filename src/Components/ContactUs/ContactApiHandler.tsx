import { sendContactMessage } from '../../Api/ContactUsApi'
import { ContactMessagePayload } from '../../Components/Types/contact';

export const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  name: string,
  subject: string,
  message: string,
  setSnackbarMessage: (message: string) => void,
  setOpenSnackbar: (isOpen: boolean) => void,
  setName: (name: string) => void,
  setSubject: (subject: string) => void,
  setMessage: (message: string) => void
) => {
  event.preventDefault();
  try {
    const userString = localStorage.getItem('userData');
    if (userString) {
      const userObject = JSON.parse(userString);
      const invitedBy = userObject.email;
      console.log("userEmail", invitedBy);
      const payload: ContactMessagePayload = { name, subject, message, invitedBy };
      await sendContactMessage(payload);


      setSnackbarMessage('Message sent successfully!');
      setOpenSnackbar(true);
      setName('');
      setSubject('');
      setMessage('');
    }
  } catch (error) {
    console.error(error);
    setSnackbarMessage('Error sending message. Please try again.');
    setOpenSnackbar(true);
  }
};
