import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

function SunburstDiagram() {
    const { user } = useUserContext();
    console.log(user);
    const chartRef = useRef(null);
    const [data, setData] = useState(null);
    const { path } = useUserContext();
    const customColors = ['#8c228e', '#A827AB', '#b04bb2', '#b162b3', '#dc7edd', '#e89ee9'];
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            renderSunburstDiagram();
        }
    }, [data]);

    useEffect(() => {
        return () => {
            cleanUpChart();
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${path}ProjectsAndTasks`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const projects = await response.json();
            const data = transformData(projects);
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const transformData = (projects) => {
        const root = { name: 'Root', children: [] };
        projects.forEach((project) => {
            const category = project.ProjectName;
            const categoryNode = root.children.find((child) => child.name === category);
            if (categoryNode) {
                categoryNode.children.push(
                    ...project.Tasks.map((task) => ({
                        name: task.TaskName,
                        value: 100,
                        children: [
                            {
                                name: task.Employeename,
                                value: 100,
                                TaskID: task.TaskID,
                                TaskName: task.TaskName,
                                ProjectID: task.ProjectID,
                                TaskType: task.TaskType,
                                TaskDescription: task.TaskDescription,
                                InsertTaskDate: task.InsertTaskDate,
                                Deadline: task.Deadline,
                                isDone: task.isDone,
                                isDeleted: task.isDeleted
                            },
                        ],
                    }))
                );
            } else {
                root.children.push({
                    name: category,
                    value: 1,
                    Project: {
                        ProjectID: project.ProjectID,
                        ProjectName: project.ProjectName,
                        ProjectDescription: project.Description,
                        CustomerPK: project.CustomerPK,
                        InsertprojectDate: project.InsertDate,
                        Deadline: project.Deadline,
                        isDone: project.isDone        
                    },
                    children: project.Tasks.map((task) => ({
                        name: task.TaskName,
                        value: 1,
                        children: [
                            {
                                name: task.EmployeeName,
                                value: 100,
                                TaskID: task.TaskID,
                                TaskName: task.TaskName,
                                ProjectID: task.ProjectID,
                                TaskType: task.TaskType,
                                TaskDescription: task.TaskDescription,
                                InsertTaskDate: task.InsertTaskDate,
                                Deadline: task.Deadline,
                                isDone: task.isDone,
                                isDeleted: task.isDeleted
                            },
                        ],
                    })),
                });
            }
        });
        return root;
    };

    const renderSunburstDiagram = () => {
        cleanUpChart();

        const width =1000; // Adjust the width as per your requirement
        const height = 1000; // Adjust the height as per your requirement

        const radius = Math.min(width, height) / 2;
        const color = d3.scaleOrdinal(customColors);

        const partition = d3.partition().size([2 * Math.PI, radius]);

        const arc = d3.arc()
            .startAngle((d) => d.x0)
            .endAngle((d) => d.x1)
            .padAngle(0.002)
            .padRadius(radius / 3)
            .innerRadius((d) => d.y0)
            .outerRadius((d) => d.y1 - 1);

        const svg = d3
            .select(chartRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const root = d3.hierarchy(data).sum((d) => d.value);
        partition(root);

        const format = d3.format(",d");

        svg
            .selectAll("path")
            .data(root.descendants().filter(d => d.depth))
            .enter()
            .append("path")
            .attr("d", arc)
            .style("fill", (d) => {
                while (d.depth > 1) d = d.parent;
                return color(d.data.name);
            })
            .attr("fill-opacity", 0.6)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .style("cursor", "pointer")
            .on("click", clicked);

        function handleMouseOver(event, d) {
            d3.select(this).style("opacity", 0.8);
        }

        function handleMouseOut(event, d) {
            d3.select(this).style("opacity", 1);
        }

        // Add a label for each element.
        svg.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .attr("font-size", 13)
            .attr("font-family", "calibri")
            .attr('font-size', '15px')// Change the font size
            .selectAll("text")
            .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
            .join("text")
            .attr("transform", function (d) {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            })
            .attr("dy", "0.35em")
            .text(d => d.data.name)

    };

    function clicked(event, p) {
        if (p.depth === 2) {
            const task = {
                TaskID: p.data.children[0].TaskID,
                TaskName: p.data.children[0].TaskName,
                ProjectID: p.data.children[0].ProjectID,
                TaskType: p.data.children[0].TaskType,
                TaskDescription: p.data.children[0].TaskDescription,
                InsertTaskDate: p.data.children[0].InsertTaskDate,
                Deadline: p.data.children[0].Deadline,
                isDone: p.data.children[0].isDone,
                isDeleted: p.data.children[0].isDeleted
            }
            // Clicked on a task
            navigate('/task', { state: task }); // Navigate to the task details page using the task ID

            
        } else if (p.depth === 1) {
            console.log(p); // Check the structure of the p object
            console.log("p.data project"); // Check the value of p.data
            console.log(p.data); // Check the value of p.data
            console.log("p.data.Project"); // Check the value of p.data
            console.log(p.data.Project); // Check the value of p.data
            // Clicked on a project
            const project = p.data.Project;
            console.log("projectid:");
            console.log(p.data.Project);
            navigate('/project', { state: project });
        }
    }

    const cleanUpChart = () => {
        d3.select(chartRef.current).select('svg').remove();
    };

    return <div ref={chartRef}></div>;
}

export default SunburstDiagram;
