import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@material-ui/core';
import { RadarChart } from '../charts/radarChart';
import { ReportingService } from '../../../services/reportingService';
import { ErrorBoundary } from 'react-error-boundary';

interface PipelineHealthData {
  totalDeals: number;
  activeDeals: number;
  stalledDeals: number;
  overdueTasks: number;
  avgDealAge: number;
  stageDistribution: Array<{
    stageName: string;
    dealCount: number;
    percentage: number;
  }>;
}

export const PipelineHealthReport: React.FC = () => {
  const [data, setData] = useState<PipelineHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reportingSvc = new ReportingService(ErrorBoundary);

  useEffect(() => {
    reportingSvc.getPipelineHealth()
      .then((result: PipelineHealthData) => {
        setData(result);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  const pieData = data.stageDistribution.map(stage => ({
    label: stage.stageName,
    value: stage.dealCount
  }));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Pipeline Health</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <RadarChart 
                data={pieData} 
                title="Deal Distribution by Stage" 
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Health Metrics</Typography>
              <Box mb={2}>
                <Typography variant="h4" color="primary">{data.totalDeals}</Typography>
                <Typography variant="body2">Total Deals</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h4" color="primary">{data.activeDeals}</Typography>
                <Typography variant="body2">Active Deals</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h4" color="secondary">{data.stalledDeals}</Typography>
                <Typography variant="body2">Stalled Deals</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h4" color="error">{data.overdueTasks}</Typography>
                <Typography variant="body2">Overdue Tasks</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h4" color="primary">{data.avgDealAge}</Typography>
                <Typography variant="body2">Avg Deal Age (days)</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Stage Distribution</Typography>
              <Grid container spacing={2}>
                {data.stageDistribution.map((stage, index) => (
                  <Grid item xs={12} sm={6} md={2} key={index}>
                    <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={1}>
                      <Typography variant="h5" color="primary">{stage.dealCount}</Typography>
                      <Typography variant="body2">{stage.stageName}</Typography>
                      <Typography variant="caption">{stage.percentage}%</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};