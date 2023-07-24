import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://proj.ruppin.ac.il/cgroup95/prod/api/listtasksforallemployee')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current);

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Parse the NumberOfOpenTasks values as integers
    data.forEach((d) => {
      d.NumberOfOpenTasks = +d.NumberOfOpenTasks;
    });

    x.domain(data.map((d) => d.EmployeeName));
    y.domain([0, d3.max(data, (d) => d.NumberOfOpenTasks)]);

    svg
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)
  .selectAll('.bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', (d) => x(d.EmployeeName))
  .attr('y', (d) => y(d.NumberOfOpenTasks))
  .attr('width', x.bandwidth())
  .attr('height', (d) => height - y(d.NumberOfOpenTasks))
  .attr('fill', '#A827AB') // Change the color here, e.g., 'blue', '#3498db', 'rgb(52, 152, 219)', etc.
  .attr('stroke', 'black') // Add a black border
  .attr('stroke-width', 2); // Set the border width to 2 pixels

  svg
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)
  .selectAll('.bar-label')
  .data(data)
  .enter()
  .append('text')
  .attr('class', 'bar-label')
  .attr('x', (d) => x(d.EmployeeName) + x.bandwidth() / 2)
  .attr('y', (d) => y(d.NumberOfOpenTasks) - 5) // Adjust the position of the number on the bar
  .attr('text-anchor', 'middle') // Center the text horizontally on the bar
  .text((d) => d.NumberOfOpenTasks)
  .attr('font-family', 'Calibri')
  .attr('font-size', '20px')
  .attr('fill', 'Black'); // Set the color of the number

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(xAxis)
      .selectAll('text') // Select all axis label text elements
      .attr('font-family', 'Calibri') // Change the font family
      .attr('font-size', '20px'); // Change the font size

    // svg
    //   .append('g')
    //   .attr('transform', `translate(${margin.left},${margin.top})`)
    //   .call(yAxis)
    //   .selectAll('text') // Select all axis label text elements
    //   .attr('font-family', 'Calibri') // Change the font family
    //   .attr('font-size', '12px'); // Change the font size
  }, [data]);

  return (
    <svg ref={svgRef} width={800} height={450}>
      <g />
    </svg>
  );
};

export default BarChart;
