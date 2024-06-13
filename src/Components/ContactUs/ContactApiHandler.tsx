import { sendContactMessage } from '../../Api/ContactUsApi'
import { ContactMessagePayload } from '../../Components/Types/contact';

export const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  name: string,
  email: string,
  message: string,
  setSnackbarMessage: (message: string) => void,
  setOpenSnackbar: (isOpen: boolean) => void,
  setName: (name: string) => void,
  setemail: (email: string) => void,
  setMessage: (message: string) => void
) => {
  event.preventDefault();
  try {
    const userString = localStorage.getItem('userData');
    if (userString) {
      const userObject = JSON.parse(userString);
      const userId = userObject.id;
      console.log("userId", userId);
      const payload: ContactMessagePayload = { userId, name, email, message };
      await sendContactMessage(payload);

      setSnackbarMessage('Message sent successfully!');
      setOpenSnackbar(true);
      setName('');
      setemail('');
      setMessage('');
    }
  } catch (error) {
    console.error(error);
    setSnackbarMessage('Error sending message. Please try again.');
    setOpenSnackbar(true);
  }
};
