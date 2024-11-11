import React from 'react';
import styled from 'styled-components';
import { Stage } from '../../../models/stage'; // Ensure Stage is correctly imported


interface StagesProgressBarProps {
  stages: Stage[];
  currentStageId: number;
}

const StagesProgressBar: React.FC<StagesProgressBarProps> = ({ stages, currentStageId }) => {
    return (
      <div className="stages-progress-bar">
        <div className="pipeline-stage-container">
          {stages.map((stage, index) => (
            <div
              key={stage.stageID}
              className={`pipeline-stage ${stage.stageID === currentStageId ? 'current-stage' : ''} ${stage.stageID <= currentStageId ? 'completed' : ''}`}
            >
              <label>{stage.stageName}</label>
              {index < stages.length - 1 && <span className="stage-separator"></span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

export default StagesProgressBar;
