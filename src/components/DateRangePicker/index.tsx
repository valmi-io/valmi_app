import React from 'react';
import { Select, MenuItem, TextField, Stack, SelectChangeEvent } from '@mui/material';

interface DateRangePickerProps {
  dateRange: { timeRange: string; start_date: Date; end_date: Date };
  onDateRangeChange: (value: string) => void;
  setDateRange: (dateRange: { timeRange: string; start_date: Date; end_date: Date }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onDateRangeChange, setDateRange }) => {
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    onDateRangeChange(e.target.value);
  };

  return (
    <Stack direction="row" spacing={2}>
      <Select value={dateRange.timeRange} onChange={handleSelectChange}>
        <MenuItem value="last7days">Last 7 days</MenuItem>
        <MenuItem value="last14days">Last 14 days</MenuItem>
        <MenuItem value="last30days">Last 30 days</MenuItem>
        <MenuItem value="lastMonth">Last Month</MenuItem>
      </Select>
      <TextField
        label="Start Date"
        type="date"
        value={dateRange.start_date.toISOString().split('T')[0]}
        onChange={(e) => setDateRange({ ...dateRange, start_date: new Date(e.target.value) })}
      />
      <TextField
        label="End Date"
        type="date"
        value={dateRange.end_date.toISOString().split('T')[0]}
        onChange={(e) => setDateRange({ ...dateRange, end_date: new Date(e.target.value) })}
      />
    </Stack>
  );
};

// Utility function to calculate date ranges based on selected time range
export const getDateRange = (timeRange: string): { timeRange: string; start_date: Date; end_date: Date } => {
    let startDate = new Date();
    let endDate = new Date();

    switch (timeRange) {
      case 'last7days':
        startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last14days':
        startDate = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'lastMonth':
        startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        break;
      default:
        break;
    }

    return { timeRange, start_date: startDate, end_date: endDate };
  };

export default DateRangePicker;
