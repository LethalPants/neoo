import { Form, Select, InputNumber, Switch, Slider, Button } from 'antd';

import { SmileFilled } from '@ant-design/icons';
import { Navbar } from '../components/navbar';
import Link from 'next/link';

const FormItem = Form.Item;
const Option = Select.Option;

export default function Home() {
	return (
		<div>
			<Navbar />
		</div>
	);
}
