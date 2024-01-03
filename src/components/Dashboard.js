import React, {useState, useEffect} from 'react';
import Filters from './Filters';
import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';


function Dashboard() {
    const [data, setData] = useState([]);
    const [allMonths, setAllMonths] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [allFiscalYears, setAllFiscalYears] = useState([]);
    const [allCostTypes, setAllCostTypes] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // State for the filtered data to be displayed
    const [monthlyTotals, setMonthlyTotals] = useState({});
    const [previousYearTotalSum, setPreviousYearTotalSum] = useState(0);


    const grandTotalOfTotals = Object.values(monthlyTotals).reduce((acc, current) => acc + current, 0);


    const [filters, setFilters] = useState({
        type: null,
        fiscalYear: null,
        costType: null,
        department: null,
        insertionMonth: null,  // Initially no month is selected
        currencyUnit: 'Eur'  // Default unit
    });

    const currencyUnits = ['Eur', 'KEur', 'MEur']; // Define available units

    // Function to convert values based on currency unit
    const convertCurrency = (value, unit) => {
        const unitFactors = {'Eur': 1, 'KEur': 1000, 'MEur': 1000000};
        return value / (unitFactors[unit] || 1);
    };


// Function to fetch data based on filters
    const fetchData = async (appliedFilters) => {
        const queryParams = new URLSearchParams(
            Object.entries(appliedFilters).filter(([key, value]) => value != null && !(key === 'type' && value === 'all'))
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

    // Function to apply filters
    const applyFilters = (data) => {
        return data.filter(project => {
            const typeMatch = !filters.type || filters.type === 'All' || project.type === filters.type;
            const fiscalYearMatch = !filters.fiscalYear || filters.fiscalYear === 'All' || project.fiscalYear === filters.fiscalYear;
            const costTypeMatch = !filters.costType || filters.costType === 'All' || project.costType === filters.costType;
            const departmentMatch = !filters.department || filters.department === 'All' || project.department === filters.department;
            const insertionMonthMatch = !filters.insertionMonth || filters.insertionMonth === 'All' ||
                new Date(project.insertionDate).toLocaleString('default', {month: 'long'}) === filters.insertionMonth;

            return typeMatch && fiscalYearMatch && costTypeMatch && departmentMatch && insertionMonthMatch;
        });
    };

    // useEffect hook to apply filters whenever they change
    useEffect(() => {
        const filtered = applyFilters(data);
        setFilteredData(filtered);
    }, [filters, data]);


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
                new Date(project.insertionDate).toLocaleString('default', {month: 'long'})
            ))).sort((a, b) => new Date(`1 ${a} 2000`) - new Date(`1 ${b} 2000`));

            setAllMonths(uniqueMonths);
            setAllTypes(extractUniqueOptions(result.projects, 'type'));
            setAllFiscalYears(extractUniqueOptions(result.projects, 'fiscalYear'));
            setAllCostTypes(extractUniqueOptions(result.projects, 'costType'));
            setAllDepartments(extractUniqueOptions(result.projects, 'department'));

        };
        fetchInitialData();
    }, []);

    const extractUniqueOptions = (data, key) => {
        return [...new Set(data.map(item => item[key]))].sort();
    };

    // Fetch data when filters change
    useEffect(() => {
        fetchData(filters);
    }, [filters]);

    // Determine business months for table headers
    const businessMonths = Array.from(new Set(data.flatMap(project =>
        Object.keys(project.businessMonth["2023"])
    )));

    // console.log('insertionMonths ', insertionMonths)

    console.log('bus ', businessMonths)

    useEffect(() => {
        const totals = businessMonths.reduce((acc, month) => {
            // Summing up the cost for each month
            acc[month] = data.reduce((sum, project) => {
                const year = Object.keys(project.businessMonth)[0];
                return sum + (project.businessMonth[year][month]?.cost || 0);
            }, 0);
            return acc;
        }, {});

        // Calculate the sum for the "Previous Year Total"
        const totalPreviousYear = data.reduce((sum, project) => sum + (project.previousYearTotal || 0), 0);

        setMonthlyTotals(totals);
        setPreviousYearTotalSum(totalPreviousYear);
    }, [data, businessMonths]);


    return (
        <div>
            {/*<Filters filters={filters} setFilters={setFilters} months={allMonths}/>*/}
            <Filters
                filters={filters}
                setFilters={setFilters}
                months={allMonths}
                types={allTypes}
                fiscalYears={allFiscalYears}
                costTypes={allCostTypes}
                departments={allDepartments}
                currencyUnits={currencyUnits}
            />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Project</TableCell>
                        {businessMonths.map(month => (
                            <TableCell key={month}>
                                {month}
                                <br/>
                                <span style={{fontSize: 'smaller'}}>
                    {/* Check if the data for the month exists and then display the costPlanType */}
                                    {data.length > 0 && data[0].businessMonth["2023"][month]
                                        ? data[0].businessMonth["2023"][month].costPlanType
                                        : ''}
                </span>
                            </TableCell>
                        ))}
                        <TableCell>Grand Total</TableCell>
                        <TableCell>Previous Year Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {/* Grand Total Row */}
                    <TableRow>
                        <TableCell><strong>Grand Total</strong></TableCell>
                        {businessMonths.map(month => (
                            <TableCell
                                key={month}><strong>{convertCurrency(monthlyTotals[month], filters.currencyUnit)}</strong></TableCell>
                        ))}
                        <TableCell><strong>{convertCurrency(grandTotalOfTotals, filters.currencyUnit)}</strong></TableCell> {/* New Grand Total of Totals */}
                        <TableCell>{convertCurrency(previousYearTotalSum, filters.currencyUnit)}</TableCell>
                    </TableRow>

                    {/* Existing rows for projects */}
                    {data.map(project => {
                        const year = Object.keys(project.businessMonth)[0];
                        const rowTotal = businessMonths.reduce((sum, month) => {
                            return sum + (project.businessMonth[year][month]?.cost || 0);
                        }, 0);

                        return (
                            <TableRow key={project.project}>
                                <TableCell>{project.project}</TableCell>
                                {businessMonths.map(month => {
                                    const monthData = project.businessMonth[year][month];
                                    const convertedCost = monthData ? convertCurrency(monthData.cost, filters.currencyUnit) : 'N/A';

                                    return (
                                        <TableCell key={month}>
                                            {/* Render cost if available, otherwise 'N/A' */}
                                            {convertedCost}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{rowTotal}</TableCell> {/* Displaying the row total */}
                                <TableCell>{convertCurrency(project.previousYearTotal, filters.currencyUnit)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default Dashboard;
