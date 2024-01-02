import React from 'react';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';

function Filters({filters, setFilters, months}) {
    const handleFilterChange = (event) => {
        setFilters(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };
    // List of months for the filter
    // const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div>
            {/* Example: Type Filter */}
            <FormControl>
                <InputLabel>Type</InputLabel>
                <Select name="type" value={filters.type} onChange={handleFilterChange}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="current">Current</MenuItem>
                    <MenuItem value="future">Future</MenuItem>
                </Select>
            </FormControl>

              <FormControl>
                <InputLabel>Insertion Month</InputLabel>
                <Select
                    name="insertionMonth"
                    value={filters.insertionMonth || ""}
                    onChange={handleFilterChange}
                >
                    {months.map(month => (
                        <MenuItem key={month} value={month}>{month}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/* Add other filters similarly */}
        </div>
    );
}

export default Filters;
