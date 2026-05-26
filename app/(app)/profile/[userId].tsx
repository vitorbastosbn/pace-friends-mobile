import { useLocalSearchParams } from 'expo-router';
import { PublicProfileScreen } from '../../../src/features/profile/screens/PublicProfileScreen';

export default function PublicProfilePage() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  return <PublicProfileScreen userId={userId} />;
}
