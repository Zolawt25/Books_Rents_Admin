import React from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ name: "May", price: 100 },
	{ name: "Jun", price: 500 },
	{ name: "Jul", price: 75 },
	{ name: "Aug", price: 80 },
	{ name: "Sep", price: 250 },
	{ name: "Oct", price: 300 },
];

const yAxisTicks = [700, 500, 200, 0];
const formatYAxisTick = (value) => `${value} birr`;

export default function Analytics() {
	return (
		<ResponsiveContainer width="100%" height={400}>
			<AreaChart
				data={data}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis ticks={yAxisTicks} tickFormatter={formatYAxisTick} />
				<Tooltip />
				<Area
					type="monotone"
					dataKey="price"
					stroke="#8884d8"
					fillOpacity={1}
					fill="url(#colorUv)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
