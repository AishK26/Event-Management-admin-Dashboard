import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useMediaQuery } from "@mui/material";

export default function Charts() {
  // Media queries to detect screen sizes
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 600px) and (max-width: 1200px)"
  );

  // Define chart size based on screen size
  const chartWidth = isSmallScreen ? 200 : isMediumScreen ? 400 : 800; // Small: 200px, Medium: 400px, Large: 800px
  const chartHeight = isSmallScreen ? 200 : isMediumScreen ? 300 : 400; // Small: 200px, Medium: 300px, Large: 400px

  return (
    <div
      style={{
        width: isSmallScreen ? chartWidth : "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <BarChart
        xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
        series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
        width={chartWidth} // Dynamically adjust width
        height={chartHeight} // Dynamically adjust height
      />
    </div>
  );
}
