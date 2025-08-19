import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@material-ui/core';
import { EnhancedTable } from '../styledTable';
import { DoughnutChart } from '../charts/doughnutChart';
import { ReportingService } from '../../../services/reportingService';
import { ErrorBoundary } from 'react-error-boundary';

interface TreatmentData {
  treatmentName: string;
  totalDeals: number;
  wonDeals: number;
  totalValue: number;
  avgDealValue: number;
  conversionRate: number;
}

export const TreatmentAnalysisReport: React.FC = () => {
  const [data, setData] = useState<TreatmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reportingSvc = new ReportingService(ErrorBoundary);

  useEffect(() => {
    reportingSvc.getTreatmentAnalysis()
      .then((result: TreatmentData[]) => {
        setData(result);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const pieData = data.map(item => ({
    label: item.treatmentName,
    value: item.totalValue
  }));

  const totalValue = data.reduce((sum, item) => sum + item.totalValue, 0);
  const totalDeals = data.reduce((sum, item) => sum + item.totalDeals, 0);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Treatment Analysis</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <DoughnutChart 
                data={pieData} 
                title="Revenue by Treatment" 
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Summary</Typography>
              <Typography>Total Revenue: ${totalValue.toLocaleString()}</Typography>
              <Typography>Total Deals: {totalDeals}</Typography>
              <Typography>Avg Deal Value: ${(totalValue / totalDeals).toFixed(0)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Treatment Performance</Typography>
              <EnhancedTable 
                headers={['Treatment', 'Total Deals', 'Won Deals', 'Conversion Rate', 'Total Value', 'Avg Deal Value']}
                rows={data.map(treatment => [
                  treatment.treatmentName,
                  treatment.totalDeals,
                  treatment.wonDeals,
                  `${treatment.conversionRate}%`,
                  `$${treatment.totalValue.toLocaleString()}`,
                  `$${treatment.avgDealValue.toLocaleString()}`
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