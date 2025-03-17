import React, { useEffect, useState } from "react";
import { Card, DatePicker, message } from "antd";
import { Bar } from "@ant-design/plots";
const moment = window.moment;
function DailyUserCard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment()); // Default to current month/year

  // Function to fetch user activity data based on the selected month and year
  const fetchData = async (selectedMonth) => {
    try {
      const year = selectedMonth.year();
      const month = selectedMonth.month() + 1; // months are zero-indexed, so we add 1

      // Make API request to fetch data using fetch
      const response = await fetch(
        `https://vartha-janapada.vercel.app/api/users/getMonthlyUser?year=${year}&month=${month}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data); // Set the data from the API
      } else {
        message.error("No data found for this month.");
      }
    } catch (error) {
      console.error("Error fetching data", error);
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle the change in the DatePicker (month and year)
  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date); // Update the selected date
      setLoading(true); // Set loading state to true while fetching new data
      fetchData(date); // Fetch data for the selected month and year
    }
  };

  // Transform the data for the Bar chart
  const chartData = data.map((item) => ({
    date: item.date.slice(8, 10), // Extract day (last two digits of the date)
    count: item.count,
  }));

  // Configure the Bar chart
  const config = {
    data: chartData,
    xField: "date", // X-axis will show the day of the month
    yField: "count", // Y-axis will show the user count
    seriesField: "date",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    meta: {
      date: {
        alias: "Date",
      },
      count: {
        alias: "Users Joined",
      },
    },
    color: ["#4DB8FF", "#F37C9B", "#F8A700", "#00B38A", "#00A9E0"], // Set colors for bars
    title: {
      visible: true,
      text: "User Activity for the Selected Month", // Chart title
      style: { fontSize: 18, fontWeight: "bold" },
    },
    xAxis: {
      label: {
        style: {
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fontSize: 12,
        },
      },
    },
    legend: {
      position: "top-right", // Position the legend at the top-right
    },
    tooltip: {
      showMarkers: true, // Show markers on the tooltip
    },
    interactions: [
      {
        type: "active-region", // Enable active region interaction
      },
    ],
  };

  // Use useEffect to fetch data when the component mounts or selectedDate changes
  useEffect(() => {
    fetchData(selectedDate); // Fetch data for the current month on initial load
  }, []); // Empty dependency array makes sure this runs only once on mount

  return (
    <Card
      title="New Users Daily"
      loading={loading}
      extra={
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          picker="month"
          style={{ width: 200 }}
        />
      }
    >
      <Bar {...config} />
    </Card>
  );
}

export default DailyUserCard;
