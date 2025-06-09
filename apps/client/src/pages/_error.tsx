import type { NextPage } from 'next';
import { NotFoundError } from '../components/common/not-found-error';

const ErrorPage: NextPage = () => {
  return <NotFoundError />;
};

export default ErrorPage;
