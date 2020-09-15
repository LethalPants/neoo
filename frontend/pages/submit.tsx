import { Card, Col, Divider, Row, Space, Typography } from 'antd';
import { Formik } from 'formik';
import { Form, FormItem, Input, ResetButton, SubmitButton } from 'formik-antd';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import * as Yup from 'yup';
import { Navbar } from '../components/navbar';
import { useCreatePostMutation } from '../src/generated/graphql';
import { createUrqlClient } from '../src/utils/createUrqlClient';
import { useIsAuth } from '../src/utils/useIsAuth';

const newPostSchema = Yup.object().shape({
	title: Yup.string().required('Title is required'),
	body: Yup.string(),
});

const Submit = () => {
	const [, Submit] = useCreatePostMutation();
	useIsAuth();
	const router = useRouter();

	return (
		<>
			<Navbar />
			<Row
				align="middle"
				justify="center"
				style={{ minHeight: '80vh', marginRight: 0 }}
			>
				<Col span={14} lg={{ span: 10 }}>
					<Typography.Title level={3}>Create a Post</Typography.Title>
					<Divider />

					<Formik
						initialValues={{
							title: '',
							body: '',
						}}
						onSubmit={async (values, { setErrors }) => {
							const { error } = await Submit(values);
							if (!error) {
								router.push('/');
							}
						}}
						validationSchema={newPostSchema}
					>
						{({ isSubmitting }) => (
							<Card>
								<Form name="basic" layout="vertical" size="large">
									<FormItem name="title" label="Title" required={true}>
										<Input name="title" placeholder="Title" />
									</FormItem>
									<Card
										type="inner"
										title="Post body"
										bodyStyle={{ padding: 0 }}
										headStyle={{
											border: '1px solid #434343',
											padding: '0 11px',
										}}
										style={{ border: 'none' }}
									>
										<FormItem name="body" style={{ marginBottom: 0 }}>
											<Input.TextArea
												name="body"
												cols={6}
												rows={7}
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
		</>
	);
};

export default withUrqlClient(createUrqlClient)(Submit);
