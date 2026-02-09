export default function ClienteItem({ cliente, onSelect }) {
  return (
    <div onClick={() => onSelect(cliente)}>
      <h3>{cliente.nombre}</h3>
      <p>{cliente.email}</p>
    </div>
  );
}
