import React from 'react';
import { Formik } from 'formik';
import { SubmitButton, Input, Form, FormItem, ResetButton } from 'formik-antd';
import {
	Row,
	Col,
	Typography,
	Alert,
	Button,
	Space,
	Card,
	Divider,
} from 'antd';
import * as Yup from 'yup';

import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../src/utils/createUrqlClient';
import ButtonGroup from 'antd/lib/button/button-group';

const newPostSchema = Yup.object().shape({
	title: Yup.string().required('Title is required'),
	body: Yup.string(),
});

const Submit = () => {
	// const [, Submit] = useSubmitMutation();
	const router = useRouter();
	const [error, setError] = React.useState('');
	return (
		<Row
			align="middle"
			justify="center"
			style={{ minHeight: '80vh', marginRight: 0 }}
		>
			<Col span={8}>
				<Typography.Title level={3}>Create a Post</Typography.Title>
				<Divider />

				{error !== '' && (
					<Row>
						<Col span={16}>
							<Alert
								type="error"
								message={error}
								closable
								onClose={() => setError('')}
							/>
						</Col>
					</Row>
				)}
				<Formik
					initialValues={{
						title: '',
						body: '',
					}}
					onSubmit={async (values, { setErrors }) => {
						// const res = await Submit(values);
						// if (res.data?.Submit.errors) {
						// 	setError(res.data.Submit.errors[0].message);
						// } else if (res.data?.Submit.user) {
						// 	router.push('/');
						// }
						console.log(values);
					}}
					validationSchema={newPostSchema}
				>
					{({ isSubmitting }) => (
						<Card>
							<Form name="basic" layout="vertical" size="large">
								<FormItem name="title" label="Title" required={true}>
									<Input
										name="title"
										placeholder="Title"
										onChange={() => setError('')}
									/>
								</FormItem>
								<Card
									type="inner"
									title="Post body"
									bodyStyle={{ padding: 0 }}
									headStyle={{ border: '1px solid #434343', padding: '0 11px' }}
									style={{ border: 'none' }}
								>
									<FormItem name="body" style={{ marginBottom: 0 }}>
										<Input.TextArea
											name="body"
											cols={6}
											rows={7}
											onChange={() => setError('')}
											placeholder="Write your post here"
										/>
									</FormItem>
								</Card>

								<Row justify="end" style={{ marginTop: 20 }}>
									<Space>
										<ResetButton size="large">Cancel</ResetButton>
										<SubmitButton loading={isSubmitting} size="large">
											Post
										</SubmitButton>
									</Space>
								</Row>
							</Form>
						</Card>
					)}
				</Formik>
			</Col>
		</Row>
	);
};

export default withUrqlClient(createUrqlClient)(Submit);
