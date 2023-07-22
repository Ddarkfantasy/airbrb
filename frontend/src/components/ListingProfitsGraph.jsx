import {useState,useEffect} from 'react';
import dayjs from 'dayjs';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// for get data
const getAllValidData = (bookings)=>{
  // current day 
  const current = dayjs(dayjs().format('DD/MM/YYYY'),'DD/MM/YYYY');
  const validData = [];
  for (let index = 0; index < 31; index++) {
    validData.push(0);
  }
  // if have data
  if (bookings) {
    bookings.forEach((booking)=>{
      // status accepted means make money but seperate them to a single day
      if (booking.status==="accepted") {
        for (const singleDayString of booking.dateRange) {
          const singleDay = dayjs(singleDayString,'DD/MM/YYYY');
          // check if the diff is between 0 to 30
          const price = booking.totalPrice / booking.dateRange.length;
          const dayDiff = current.diff(singleDay,'day');
          if (0<=dayDiff<=30) {
            // use single price to add
            validData[dayDiff] += price;
          }
        }
      }
    })
  }
  return validData;
}

// for get graph set
const labels = ['today', '1 day ago','2 days ago','3 days ago','4 days ago','5 days ago','6 days ago','7 days ago',
'8 days ago','9 days ago','10 days ago','11 days ago','12 days ago','13 days ago',
'14 days ago','15 days ago','16 days ago','17 days ago','18 days ago','19 days ago',
'20 days ago','21 days ago','30 days ago',] 
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Listing Profits Graph over 30 days',
    },
  },
};

function ListingProfitsGraph(props) {
  const {bookings}=props;
  const [yValues, setyValues] = useState(getAllValidData(bookings));
  useEffect(() => {
    setyValues(getAllValidData(bookings));
  }, [bookings]);
  const [data, setData] = useState(null);
  useEffect(()=>{
    // for get graph set
    if (yValues) {
      const originalData = {
        labels,
        datasets: [
          {
            label: 'Profit:$',
            data: yValues.map((yValue, index) => [index, yValue]),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
      setData(originalData);
    }
  },[yValues]);

  return (
    <div>{data && <Line options={options} data={data} />}</div>
  )
}

export default ListingProfitsGraph;






