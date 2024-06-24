import * as React from 'react';
import '../App.css';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Mapa</h3>
      <p>Passe o mause sobre os locais para destaca-los.</p>
    </div>
  );
}

export default React.memo(ControlPanel);