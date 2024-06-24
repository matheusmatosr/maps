import * as React from 'react';
import '../assets/style.css';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Mapa</h3>
      <p>Passe o mause sobre os locais marcados para destaca-los.</p>
    </div>
  );
}

export default React.memo(ControlPanel);