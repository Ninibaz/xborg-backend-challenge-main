import type { NextPage } from 'next';
import { NotFoundError } from '../components/common/not-found-error';

const NotFound: NextPage = () => {
  return <NotFoundError />;
};

export default NotFound;
