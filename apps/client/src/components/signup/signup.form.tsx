import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { object, string } from 'yup';
import { connectWallet, signInWithEthereum } from '../../blockchain/siwe';
import { Flex } from '../common/flex';
import { FormikTextField } from '../common/formik-text.field';
import { signup } from '../../axios/user/requests';
import { useUserSession } from '../../providers/user-session.provider';
import Image from 'next/image';
import { PROFILE } from '../../config/routes';
import { useRouter } from 'next/router';

interface Signup {
  userName: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

const signupSchema = object({
  userName: string().required('Username is required'),
  email: string().email('Must be a valid email'),
  firstName: string(),
  lastName: string(),
});

export const SignupForm = () => {
  const { push } = useRouter();
  const { setSessionCookie } = useUserSession();

  const signUp = async ({ userName, firstName, lastName, email }: Signup) => {
    const accounts = await connectWallet();

    if (accounts && accounts?.length) {
      const signed = await signInWithEthereum();

      if (signed?.message && signed?.signature) {
        const signupRes = await signup({
          message: signed?.message,
          signature: signed?.signature,
          userName,
          firstName,
          lastName,
          email,
        }).catch((error) => {
          // Do some real error handling here e.g. render a modal
          console.error(error.message);
        });

        if (signupRes?.data) {
          setSessionCookie(signupRes.data.token);
          push(PROFILE);
        }
      }
    }
  };

  return (
    <Formik<Signup>
      initialValues={{
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
      }}
      validationSchema={signupSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await signUp(values);

        resetForm();
        setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Box sx={{ mt: 3 }}>
            <Field
              component={FormikTextField}
              fullWidth
              name="userName"
              type="text"
              label="Username"
              required
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Field
              component={FormikTextField}
              fullWidth
              name="email"
              type="email"
              label="Email address"
            />
          </Box>
          <Flex sx={{ width: '100%', mt: 3 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <Field
                component={FormikTextField}
                fullWidth
                name="firstName"
                type="text"
                label="First name"
              />
            </Box>
            <Box sx={{ width: '100%', ml: 1 }}>
              <Field
                component={FormikTextField}
                fullWidth
                name="lastName"
                type="text"
                label="Last name"
              />
            </Box>
          </Flex>

          <Box mt={3}>
            <LoadingButton
              onClick={submitForm}
              loading={isSubmitting}
              variant="contained"
              fullWidth
              sx={{ minHeight: '44px' }}
            >
              <Flex
                sx={{
                  alignItems: 'center',
                  display: isSubmitting ? 'none' : 'flex',
                }}
              >
                <Image
                  src={'/images/svg/metamask.svg'}
                  height={25}
                  width={25}
                  alt=""
                />
                <Typography sx={{ ml: 1 }}>Sign up with Metamask</Typography>
              </Flex>
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
