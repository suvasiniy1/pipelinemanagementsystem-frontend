import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@material-ui/core';
import { EnhancedTable } from '../styledTable';
import { HorizontalBarChart } from '../charts/horizontalBarChart';
import { ReportingService } from '../../../services/reportingService';
import { ErrorBoundary } from 'react-error-boundary';

interface UserData {
  userId: number;
  userName: string;
  dealsCreated: number;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  conversionRate: number;
  avgDealValue: number;
}

export const UserPerformanceReport: React.FC = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reportingSvc = new ReportingService(ErrorBoundary);

  useEffect(() => {
    reportingSvc.getUserPerformance()
      .then((result: UserData[]) => {
        setData(result);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const chartData = {
    labels: data.map(user => user.userName),
    datasets: [
      {
        label: 'Revenue ($)',
        data: data.map(user => user.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Deals Won',
        data: data.map(user => user.dealsWon),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>User Performance</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <HorizontalBarChart 
                data={data.map(user => ({ label: user.userName, value: user.revenue }))}
                title="Revenue by User"
                xAxisLabel="Revenue ($)"
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Performance Details</Typography>
              <EnhancedTable 
                headers={['User', 'Deals Created', 'Deals Won', 'Deals Lost', 'Conversion Rate', 'Revenue']}
                rows={data.map(user => [
                  user.userName,
                  user.dealsCreated,
                  user.dealsWon,
                  user.dealsLost,
                  `${user.conversionRate}%`,
                  `$${user.revenue.toLocaleString()}`
                ])}
                alignments={['left', 'right', 'right', 'right', 'right', 'right']}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};