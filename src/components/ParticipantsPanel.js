import React from 'react';
import { Typography, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

const ParticipantsPanel = ({ participants, active }) => (
  <div className="participants-panel">
    <div className="participants-header">
      <Typography variant="subtitle1">Participants</Typography>
      <Typography variant="body2">
        ({participants ? participants.length : 0})
      </Typography>
      <IconButton size="small">
        <AddIcon />
      </IconButton>
    </div>
    {participants &&
      participants.map(p => (
        <div key={p.id} className="participant">
          <div
            className="participant-color"
            style={{ backgroundColor: p.color }}
          />
          <Typography variant="body1">{p.name}</Typography>
          {p.id === active && <EditIcon fontSize="small" />}
        </div>
      ))}
  </div>
);

export default ParticipantsPanel;
