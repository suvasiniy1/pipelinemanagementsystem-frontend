import React from 'react';
import './PipelineView.css'; // Create a PipelineView.css file for styling

const PipelineView = () => {
  // Placeholder data - you'll likely be fetching this from your backend
  const stages = [
   // { name: 'Lead In', deals: [...] },
   // { name: 'Contact Made', deals: [...] },
    // ... other stages
  ];

  return (
    <div className="pipeline-view">
      {stages.map(stage => (
        <div key={stage.name} className="stage">
          <h3>{stage.name}</h3>
          {/* Map over deals within each stage */}
          {stage.deals.map(deal => (
            <div key={deal.id} className="deal">
              {/* Display deal information */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PipelineView;
