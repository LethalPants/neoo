import React from 'react';
import { Formik } from 'formik';
import {
	SubmitButton,
	Input,
	Checkbox,
	ResetButton,
	FormikDebug,
	Form,
	FormItem,
} from 'formik-antd';
import { Row, Col, Typography, Alert } from 'antd';
import * as Yup from 'yup';
import { useLoginMutation } from '../src/generated/graphql';
import { useRouter } from 'next/router';

const RegisterSchema = Yup.object().shape({
	username: Yup.string().required('Username is required'),
	password: Yup.string().required('Password is required'),
});

const Login = () => {
	const [, login] = useLoginMutation();
	const router = useRouter();
	const [error, setError] = React.useState('');
	return (
		<Row
			align="middle"
			justify="start"
			style={{ minHeight: '100vh', marginRight: 0 }}
			gutter={[8, 16]}
		>
			<Col span={12} offset={2}>
				<Typography.Title level={3}>Create an account</Typography.Title>
				{error !== '' && (
					<Row>
						<Col span={16}>
							<Alert type="error" message={error} banner />
						</Col>
					</Row>
				)}
				<Formik
					initialValues={{
						username: '',
						email: '',
						password: '',
					}}
					onSubmit={async (values, { setErrors }) => {
						const res = await login(values);
						if (res.data?.login.errors) {
							setError(res.data.login.errors[0].message);
						} else if (res.data?.login.user) {
							router.push('/');
						}
					}}
					validationSchema={RegisterSchema}
				>
					{({ isSubmitting }) => (
						<Form
							labelCol={{ xs: 6 }}
							wrapperCol={{ xs: 16 }}
							name="basic"
							layout="vertical"
							size="large"
						>
							<FormItem name="username" label="Username" required={true}>
								<Input name="username" placeholder="Username" />
							</FormItem>
							<FormItem name="password" label="Password" required={true}>
								<Input.Password name="password" placeholder="Password" />
							</FormItem>

							<SubmitButton
								loading={isSubmitting}
								style={{ marginBottom: '10px' }}
							>
								Login
							</SubmitButton>
						</Form>
					)}
				</Formik>
				<Typography.Text>Don't have an account? </Typography.Text>
				<Typography.Link href="/login">Register</Typography.Link>{' '}
			</Col>
		</Row>
	);
};

export default Login;
