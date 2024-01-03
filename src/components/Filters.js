import React from 'react';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';

function Filters({filters, setFilters, months, types, fiscalYears, costTypes, departments, currencyUnits }) {
    const handleFilterChange = (event) => {
        setFilters(prev => ({...prev, [event.target.name]: event.target.value}));
    };

    return (
        <div>
            {/* Dynamic Type Filter */}
            <FormControl>
                <InputLabel>Type</InputLabel>
                <Select name="type" value={filters.type || ''} onChange={handleFilterChange}>
                    <MenuItem value="all">All</MenuItem>
                    {types.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/*Insertion Month*/}
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
            {/*Fiscal Years*/}
            <FormControl>
                <InputLabel>Fiscal Year</InputLabel>
                <Select
                    name="fiscalYear"
                    value={filters.fiscalYear || ""}
                    onChange={handleFilterChange}
                >
                    {fiscalYears.map(fy => (
                        <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                    ))}
                </Select>
            </FormControl>
              {/* Currency Unit Filter */}
            <FormControl>
                <InputLabel>Currency Unit</InputLabel>
                <Select name="currencyUnit" value={filters.currencyUnit || ''} onChange={handleFilterChange}>
                    {currencyUnits.map(unit => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default Filters;
