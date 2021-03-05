import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { 
	UserOutlined,
	LockOutlined
} from '@ant-design/icons';
import { useDispatch } from "react-redux";
import KakaoBtn from "../SNSButton/KakaoBtn";
import GoogleBtn from "../SNSButton/GoogleBtn";
import NaverBtn from "../SNSButton/NaverBtn";

const { Title } = Typography;

function LoginPage(props) {
	const dispatch = useDispatch(); //dispatch for redux
	const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

	const [formErrorMessage, setFormErrorMessage] = useState('');
	const [rememberMe, setRememberMe] = useState(rememberMeChecked);

	const handleRememberMe = () => {
		setRememberMe(!rememberMe);
	};

	const initialID = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

	return (
		<Formik
			initialValues={{ //초기값
				userID: initialID,
				password: '',
			}}
			validationSchema={
				Yup.object().shape({ //검증 규칙 설정
					userID: Yup
									.string()
									// .email('Email is invalid')
									.min(6, 'ID must be at least 6 characters')
									.required('ID is required'),
				password: Yup
										.string()
										.min(6, 'Password must be at least 6 characters')
										.required('Password is required'),
			})}
			onSubmit={(values, { setSubmitting }) => {
				setTimeout(() => {
					let dataToSubmit = {
						userID: values.userID,
						password: values.password
					};
				  
					dispatch(loginUser(dataToSubmit))
						.then(response => {
							if (response.payload.success) {
								window.localStorage.setItem('userId', response.payload.userId);
								if (rememberMe === true) {
									window.localStorage.setItem('rememberMe', values.userID);
								} else {
									localStorage.removeItem('rememberMe');
								}
								props.history.push("/");
							} else {
								setFormErrorMessage('Check out your Account or Password again'); //에러 메세지 세팅
							}
						})
						.catch(err => {
							setFormErrorMessage('Error occurred');
							setTimeout(() => { //일정 시간이 지난 후 함수 실행 setTimeout(실행시킬 함수, 시간)
								setFormErrorMessage("");
							}, 3000);
						});
					setSubmitting(false);
				}, 500);
			}}
		>
		  {props => {
			const {
				values,
				touched,
				errors,
				// dirty,
				isSubmitting,
				handleChange,
				handleBlur,
				handleSubmit,
				// handleReset,
			} = props;
			return (
				<div className="app">
					<Title level={2}>Log In</Title>
					<form onSubmit={handleSubmit} style={{ width: '350px' }}>                    
						<Form.Item required>
							<Input
								id="userID"
								prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="Enter your ID"
								type="text"
								value={values.userID}
								onChange={handleChange}
								onBlur={handleBlur}
								className={
									errors.userID && touched.userID ? 'text-input error' : 'text-input'
								}
							/>
							{errors.userID && touched.userID && (
								<div className="input-feedback">{errors.userID}</div>
							)}
						</Form.Item>

						<Form.Item required>
							<Input
								id="password"
								prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="Enter your password"
								type="password"
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								className={
									errors.password && touched.password ? 'text-input error' : 'text-input'
								}
							/>
							{errors.password && touched.password && (
								<div className="input-feedback">{errors.password}</div>
							)}
						</Form.Item>

						{formErrorMessage && (
							<label >
								<p style={{ 
									color: '#ff0000bf', 
									fontSize: '0.7rem',
									border: '1px solid', 
									padding: '1rem', 
									borderRadius: '10px' 
									}}
								>
									{formErrorMessage}
								</p>
							</label>
						)}

						<Form.Item>
							<Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >
								Remember me
							</Checkbox>
							<a className="login-form-forgot" href="/reset_user" style={{ float: 'right' }}>
								forgot password
							</a>
							<div>
								<Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
									Log in
								</Button>
							</div>
							<KakaoBtn />
							<GoogleBtn />
							<NaverBtn />
							
							<a href="/register">
								register now!
							</a>
							
						</Form.Item>
					</form>
				</div>
			);
		  }}
		</Formik>
	);
};

export default withRouter(LoginPage);