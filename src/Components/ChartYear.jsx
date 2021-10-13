import { React } from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../helpers/hooks";
import { getDocs, collection, query, where } from "@firebase/firestore";
import { db } from "../firebaseConfig";
import { debug } from "loglevel";

const Wrapper = styled.div`
	height: 100vh;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const ChartCont = styled.div`
	background: rgba(255, 255, 255, 0.06);
	border-radius: 10px;
	margin-bottom: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const SelectChart = styled.select`
	display: inline-block;
	margin-bottom: 15px;
	width: 10%;
	background-color: #3c3b5a;
  height: 30px;
  color: white;
  font-size: 16px;
`;

const SelectYear = ({ onChange, ...props }) => {
	const currentYear = new Date().getFullYear();
	const years = new Array(4).fill().map((v, i) => currentYear - i);
	return (
		<SelectChart onChange={(e) => onChange(e, e.target.value)} {...props}>
			{years.map((year) => (
				<option key={year}>{year}</option>
			))}
		</SelectChart>
	);
};

function ApexChart() {
	const currentUser = useCurrentUser();
	const [selectedYear, setSelectedYear] = useState(2021);
	const start = +new Date(+selectedYear, 0);
	const end = +new Date(+selectedYear + 1, 0);
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		// zapytanie do firebase
		if (!currentUser) {
			return;
		}
		const fetchFirestore = async () => {
			console.log(start, end, currentUser);
			// debugger;
			const queryDate = query(
				collection(db, "users", currentUser.uid, "transactions"),
				where("type", "==", "expense"),
				where("date", ">", new Date(start)),
				where("date", "<", new Date(end))
			);
			const querySnapshot = await getDocs(queryDate);
			console.log(querySnapshot.size);
			setTransactions(querySnapshot.docs.map((t) => t.data()));
		};

		fetchFirestore();
	
	}, [start, end, currentUser]);

	const categories = ["groceries", "household", "work", "other"];

	const entries = categories.map((category) => [
		category,
		new Array(12).fill(0),
	]);
	const data2 = Object.fromEntries(entries);
	transactions.forEach((transaction) => {
		const category = transaction.category;
		const month = transaction.date.toDate().getMonth();
		data2[category][month] += transaction.value;
	});
	console.log(data2);

	const data = {
		series: [
			{
				name: `<svg width="20" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1766 3.92749C18.7861 3.92749 19.1858 4.1418 19.5855 4.61123C19.9852 5.08067 20.0551 5.7542 19.9652 6.36549L19.0159 13.06C18.8361 14.3469 17.7569 15.2949 16.4879 15.2949H5.58639C4.25742 15.2949 3.15828 14.255 3.04837 12.908L2.12908 1.7834L0.620259 1.51807C0.22057 1.44664 -0.0592117 1.04864 0.0107338 0.640433C0.0806793 0.223045 0.470376 -0.0535127 0.880056 0.0087383L3.2632 0.375101C3.60293 0.437352 3.85274 0.722074 3.88272 1.06905L4.07257 3.35499C4.10254 3.68257 4.36234 3.92749 4.68209 3.92749H18.1766ZM12.1213 9.23312H14.8891C15.3088 9.23312 15.6386 8.88615 15.6386 8.46774C15.6386 8.03912 15.3088 7.70236 14.8891 7.70236H12.1213C11.7016 7.70236 11.3719 8.03912 11.3719 8.46774C11.3719 8.88615 11.7016 9.23312 12.1213 9.23312Z" fill="#2EE1ED"/>
          <path d="M5.42631 16.9079C4.58697 16.9079 3.9075 17.6018 3.9075 18.459C3.9075 19.3061 4.58697 20 5.42631 20C6.25567 20 6.93514 19.3061 6.93514 18.459C6.93514 17.6018 6.25567 16.9079 5.42631 16.9079Z" fill="#2EE1ED"/>
          <path d="M16.6676 16.9079C15.8282 16.9079 15.1487 17.6018 15.1487 18.459C15.1487 19.3061 15.8282 20 16.6676 20C17.4969 20 18.1764 19.3061 18.1764 18.459C18.1764 17.6018 17.4969 16.9079 16.6676 16.9079Z" fill="#2EE1ED"/>
          </svg>
           Groceries`,
				// data: [44, 55, 41, 67, 22, 43, 44, 55, 41, 67, 22, 43],
				data: data2.groceries,
			},
			{
				name: `<svg width="20" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.13478 18.7733V15.7156C7.13478 14.9351 7.77217 14.3023 8.55844 14.3023H11.4326C11.8102 14.3023 12.1723 14.4512 12.4393 14.7163C12.7063 14.9813 12.8563 15.3408 12.8563 15.7156V18.7733C12.8539 19.0978 12.9821 19.4099 13.2124 19.6402C13.4427 19.8705 13.7561 20 14.0829 20H16.0438C16.9596 20.0023 17.8388 19.6428 18.4872 19.0008C19.1356 18.3588 19.5 17.487 19.5 16.5778V7.86686C19.5 7.13246 19.1721 6.43584 18.6046 5.96467L11.934 0.675869C10.7737 -0.251438 9.11111 -0.221498 7.98539 0.746979L1.46701 5.96467C0.872741 6.42195 0.517552 7.12064 0.5 7.86686V16.5689C0.5 18.4639 2.04738 20 3.95617 20H5.87229C6.55123 20 7.103 19.4562 7.10792 18.7822L7.13478 18.7733Z" fill="#7037EA"/>
          </svg> Household`,
				// data: [13, 23, 20, 8, 13, 27, 13, 23, 20, 8, 13, 27],
				data: data2.household,
			},
			{
				name: `<svg width="20" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4184 4.47H14.6232C17.3152 4.47 19.5 6.72 19.5 9.48V15C19.5 17.76 17.3152 20 14.6232 20H5.3768C2.6848 20 0.5 17.76 0.5 15V9.48C0.5 6.72 2.6848 4.47 5.3768 4.47H5.58162C5.60113 3.27 6.05955 2.15 6.8886 1.31C7.72741 0.46 8.80031 0.03 10.0098 0C12.4286 0 14.3891 2 14.4184 4.47ZM7.91273 2.38C7.36653 2.94 7.06417 3.68 7.04466 4.47H12.9553C12.9261 2.83 11.6191 1.5 10.0098 1.5C9.25873 1.5 8.47844 1.81 7.91273 2.38ZM13.7064 8.32C14.116 8.32 14.4379 7.98 14.4379 7.57V6.41C14.4379 6 14.116 5.66 13.7064 5.66C13.3065 5.66 12.9748 6 12.9748 6.41V7.57C12.9748 7.98 13.3065 8.32 13.7064 8.32ZM6.93737 7.57C6.93737 7.98 6.6155 8.32 6.20585 8.32C5.80595 8.32 5.47433 7.98 5.47433 7.57V6.41C5.47433 6 5.80595 5.66 6.20585 5.66C6.6155 5.66 6.93737 6 6.93737 6.41V7.57Z" fill="#F83AA1"/>
          </svg>
          Work`,
				// data: [11, 17, 15, 15, 21, 14, 11, 17, 15, 15, 21, 14],
				data: data2.work,
			},
			{
				name: `<svg width="21" height="15" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.9184 12.3201C15.6594 12.5711 15.5404 12.9341 15.5994 13.2901L16.4884 18.2101C16.5634 18.6271 16.3874 19.0491 16.0384 19.2901C15.6964 19.5401 15.2414 19.5701 14.8684 19.3701L10.4394 17.0601C10.2854 16.9781 10.1144 16.9341 9.93939 16.9291H9.66839C9.57439 16.9431 9.48239 16.9731 9.39839 17.0191L4.96839 19.3401C4.74939 19.4501 4.50139 19.4891 4.25839 19.4501C3.66639 19.3381 3.27139 18.7741 3.36839 18.1791L4.25839 13.2591C4.31739 12.9001 4.19839 12.5351 3.93939 12.2801L0.328388 8.78012C0.0263875 8.48712 -0.0786125 8.04712 0.0593875 7.65012C0.193388 7.25412 0.535388 6.96512 0.948388 6.90012L5.91839 6.17912C6.29639 6.14012 6.62839 5.91012 6.79839 5.57012L8.98839 1.08012C9.04039 0.980122 9.10739 0.888122 9.18839 0.810122L9.27839 0.740122C9.32539 0.688122 9.37939 0.645122 9.43939 0.610122L9.54839 0.570122L9.71839 0.500122H10.1394C10.5154 0.539122 10.8464 0.764122 11.0194 1.10012L13.2384 5.57012C13.3984 5.89712 13.7094 6.12412 14.0684 6.17912L19.0384 6.90012C19.4584 6.96012 19.8094 7.25012 19.9484 7.65012C20.0794 8.05112 19.9664 8.49112 19.6584 8.78012L15.9184 12.3201Z" fill="#F2B18D"/>
          </svg> Other`,
				// data: [21, 7, 25, 13, 22, 8, 21, 7, 25, 13, 22, 8],
				data: data2.other,
			},
		],
		options: {
			chart: {
				fontFamily: "Inter",
				style: {
					borderRadius: "10px",
				},
				type: "bar",
				height: 350,
				stacked: true,
				toolbar: {
					show: false,
				},
				zoom: {
					enabled: true,
				},
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						legend: {
							position: "bottom",
							offsetX: -10,
							offsetY: 0,
						},
					},
				},
			],
			plotOptions: {
				bar: {
					horizontal: false,
					borderRadius: 10,
					dataLabels: {
						position: "top",
						maxItems: 100,
						hideOverflowingLabels: true,
					},
				},
			},
			xaxis: {
				type: "text",
				categories: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				],
				labels: {
					maxHeight: 120,
					style: {
						colors: "#fff",
						fontSize: "14px",
						fontFamily: "Inter",
						fontWeight: 400,
						cssClass: "apexcharts-xaxis-label",
					},
				},
			},
			yaxis: {
				labels: {
					style: {
						colors: "#fff",
						fontSize: "14px",
						fontFamily: "Inter",
						fontWeight: 400,
						cssClass: "apexcharts-xaxis-label",
					},
				},
			},
			legend: {
				fontSize: "18px",
				position: "right",
				labels: {
					colors: "#fff",
				},
				markers: {
					width: 0,
					height: 0,
				},
			},
			fill: {
				opacity: 1,
			},
			colors: ["#2EE1ED", "#7037EA", "#F83AA1", "#F2B18D"],
		},
	};

	return (
		<Wrapper>
			<SelectYear onChange={(e, value) => setSelectedYear(value)} />
			<ChartCont>
				<ReactApexChart
					options={data.options}
					series={data.series}
					type="bar"
					height={650}
					width={1000}
				/>
			</ChartCont>
		</Wrapper>
	);
}

export default ApexChart;
