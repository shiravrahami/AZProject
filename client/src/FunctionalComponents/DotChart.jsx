import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://proj.ruppin.ac.il/cgroup95/prod/api/taskdetailspredictionwithdifficultynew')
      .then((response) => response.json())
      .then((data) => {
        const categories = ["0", "1", "2"];
        const translatedLabels = {
          "0": "פשוטה",
          "1": "בינונית",
          "2": "מורכבת",
        };
        const barData = categories.map((category) => ({
          category: translatedLabels[category],
          value: data[category].length,
        }));
        setData(barData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(x).tickSize(0).tickPadding(10);
    const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

    x.domain(data.map((d) => d.category));
    y.domain([0, d3.max(data, (d) => d.value)]);

    svg.selectAll('*').remove(); // Clear previous elements to prevent duplicates

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.category))
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.value))
      .attr('fill', '#e89ee9')
      .attr('stroke', '#8c228e') // Add a black border
  .attr('stroke-width', 2); // Set the border width to 2 pixels

    // Add numbers on top of each bar
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .selectAll('.bar-number')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-number')
      .attr('x', (d) => x(d.category) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.value) - 5) // Adjust the y position to show the number slightly above the bar
      .attr('text-anchor', 'middle')
      .text((d) => d.value) // Display the number on each bar
      .style('fill', 'black')
      .style('font-size', '20px'); // Change the font size here

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '20px'); // Change the font size here

    
  }, [data]);

  return (
    <svg ref={svgRef} width={400} height={450}>
      <g transform={`translate(${20}, ${20})`} />
    </svg>
  );
};

export default BarChart;
