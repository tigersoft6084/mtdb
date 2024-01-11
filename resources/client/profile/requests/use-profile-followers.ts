import {useInfiniteData} from '@common/ui/infinite-scroll/use-infinite-data';
import {useParams} from 'react-router-dom';
import {User} from '@common/auth/user';

export function useProfileFollowers() {
  const {userId = 'me'} = useParams();
  return useInfiniteData<User>({
    endpoint: `users/${userId}/followers`,
    queryKey: ['users', 'profile-page-followers', userId],
    paginate: 'simple',
  });
}
