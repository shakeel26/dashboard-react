import React, {useState, useEffect} from 'react';
import Filters from './Filters';
import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';


function Dashboard() {
    const [data, setData] = useState([]);
    const [allMonths, setAllMonths] = useState([]);
    const [filters, setFilters] = useState({
        type: null,
        fiscalYear: null,
        costType: null,
        department: null,
        insertionMonth: null  // Initially no month is selected
    });

// Function to fetch data based on filters
    const fetchData = async (appliedFilters) => {
        const queryParams = new URLSearchParams(
            Object.entries(appliedFilters)            .filter(([key, value]) => value != null && !(key === 'type' && value === 'all'))
        ).toString();

        try {
            const response = await fetch(`http://localhost:8000/api/projects?${queryParams}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result.projects);
        } catch (error) {
            console.error('Fetching error:', error);
        }
    };

    // Initial fetch without filters to get all data and set allMonths
    useEffect(() => {
        const fetchInitialData = async () => {
            const response = await fetch(`http://localhost:8000/api/projects`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result.projects);

            const uniqueMonths = Array.from(new Set(result.projects.map(project =>
                new Date(project.insertionDate).toLocaleString('default', { month: 'long' })
            ))).sort((a, b) => new Date(`1 ${a} 2000`) - new Date(`1 ${b} 2000`));

            setAllMonths(uniqueMonths);
        };
        fetchInitialData();
    }, []);


    // Fetch data when filters change
    useEffect(() => {
        fetchData(filters);
    }, [filters]);


    // Extract unique insertion months from all data for filter options
    // useEffect(() => {
    //     const uniqueMonths = Array.from(new Set(data.map(project =>
    //         new Date(project.insertionDate).toLocaleString('default', {month: 'long'})
    //     ))).sort((a, b) => new Date(`1 ${a} 2000`) - new Date(`1 ${b} 2000`));
    //
    //     setAllMonths(uniqueMonths);
    // }, [data]);


    // Determine business months for table headers
    const businessMonths = Array.from(new Set(data.flatMap(project =>
        Object.keys(project.businessMonth["2023"])
    )));

    // console.log('insertionMonths ', insertionMonths)

    console.log('bus ', businessMonths)

    return (
        <div>
            <Filters filters={filters} setFilters={setFilters} months={allMonths}/>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Project</TableCell>
                        {businessMonths.map(month => (
                            <TableCell key={month}>{month}</TableCell>
                        ))}
                        <TableCell>Previous Year Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(project => {
                        const year = Object.keys(project.businessMonth)[0];
                        return (
                            <TableRow key={project.project}>
                                <TableCell>{project.project}</TableCell>
                                {businessMonths.map(month => (
                                    <TableCell key={month}>
                                        {project.businessMonth[year][month] || 'N/A'}
                                    </TableCell>
                                ))}
                                <TableCell>{project.previousYearTotal}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default Dashboard;
