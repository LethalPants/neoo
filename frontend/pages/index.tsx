import { Form, Select, InputNumber, Switch, Slider, Button } from 'antd';

import { SmileFilled } from '@ant-design/icons';

import Link from 'next/link';

const FormItem = Form.Item;
const Option = Select.Option;

const content = {
	marginTop: '100px',
};

export default function Home() {
	return <div style={content}>Hello World</div>;
}
