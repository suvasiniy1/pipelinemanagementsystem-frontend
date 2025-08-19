import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@material-ui/core';
import { LineChart } from '../charts/lineChart';
import { BarChart } from '../charts/barChart';
import { ReportingService } from '../../../services/reportingService';
import { ErrorBoundary } from 'react-error-boundary';

interface SalesData {
  month: string;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  conversionRate: number;
}

export const SalesPerformanceReport: React.FC = () => {
  const [data, setData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reportingSvc = new ReportingService(ErrorBoundary);

  useEffect(() => {
    reportingSvc.getSalesPerformance()
      .then((result: SalesData[]) => {
        setData(result);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const revenueData = data.map(item => ({ label: item.month, value: item.revenue }));
  const conversionData = data.map(item => ({ label: item.month, value: item.conversionRate }));
  
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalWon = data.reduce((sum, item) => sum + item.dealsWon, 0);
  const totalLost = data.reduce((sum, item) => sum + item.dealsLost, 0);
  const avgConversion = data.length > 0 ? (data.reduce((sum, item) => sum + item.conversionRate, 0) / data.length).toFixed(1) : 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Sales Performance</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <LineChart 
                data={revenueData} 
                title="Revenue Trend" 
                yAxisLabel="Revenue ($)" 
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <LineChart 
                data={conversionData} 
                title="Conversion Rate Trend" 
                yAxisLabel="Conversion Rate (%)" 
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Performance Summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h4" color="primary">${totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="body2">Total Revenue</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h4" color="primary">{totalWon}</Typography>
                  <Typography variant="body2">Deals Won</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h4" color="secondary">{totalLost}</Typography>
                  <Typography variant="body2">Deals Lost</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h4" color="primary">{avgConversion}%</Typography>
                  <Typography variant="body2">Avg Conversion</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};