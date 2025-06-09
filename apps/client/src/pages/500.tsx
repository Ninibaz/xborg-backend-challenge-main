import type { NextPage } from 'next';
import { NotFoundError } from '../components/common/not-found-error';

const ServerError: NextPage = () => {
  return <NotFoundError />;
};

export default ServerError;
