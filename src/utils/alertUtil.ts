import { Alert } from 'react-native';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export const showAlert = (
  title: string,
  message: string,
  buttons?: AlertButton[]
) => {
  Alert.alert(title, message, buttons || [{ text: 'OK', style: 'default' }]);
};
