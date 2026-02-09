import { useEffect, useState } from "react";

function FacturasList({ clienteId }) {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/clientes/${clienteId}/facturas`)
      .then(res => res.json())
      .then(data => setFacturas(data));
  }, [clienteId]);

  return (
    <div>
      <h3>Facturas</h3>
      <ul>
        {facturas.map((f, i) => (
          <li key={i}>
            {f.concepto} — {f.importe} €
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FacturasList;
