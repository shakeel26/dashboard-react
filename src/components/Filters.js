import React from 'react';
import {FormControl, InputLabel, Select, MenuItem, Grid} from '@mui/material';

function Filters({filters, setFilters, months, types, fiscalYears, costTypes, departments, currencyUnits}) {
    const handleFilterChange = (event) => {
        setFilters(prev => ({...prev, [event.target.name]: event.target.value}));
    };

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item style={{ margin: '10px' }}>
                    {/* Dynamic Type Filter */}
                    <FormControl style={{ width: '100%' }}>
                        <InputLabel>Type</InputLabel>
                        <Select name="type" value={filters.type || ''} onChange={handleFilterChange}>
                            <MenuItem value="all">All</MenuItem>
                            {types.map(type => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item style={{ margin: '10px' }}>
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
                </Grid>
                <Grid item style={{ margin: '10px' }}>

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
                </Grid>

                {/* Currency Unit Filter */}
                <Grid item style={{ margin: '10px' }}>
                    <FormControl>
                        <InputLabel>Currency Unit</InputLabel>
                        <Select name="currencyUnit" value={filters.currencyUnit || ''} onChange={handleFilterChange}>
                            {currencyUnits.map(unit => (
                                <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </div>
);
}

export default Filters;
