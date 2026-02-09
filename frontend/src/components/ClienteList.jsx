import ClienteItem from "./ClienteItem";

export default function ClienteList({ clientes, onSelect }) {
  return (
    <div>
      <h2>Clientes</h2>
      {clientes.map(c => (
        <ClienteItem key={c._id} cliente={c} onSelect={onSelect} />
      ))}
    </div>
  );
}
