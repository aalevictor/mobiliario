export default function TestFont() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-4xl font-bold">Teste da Fonte Manrope</h1>
      <p className="text-lg">Este é um texto de teste para verificar se a fonte Manrope está funcionando.</p>
      <p className="text-base">Texto com peso normal (400)</p>
      <p className="text-base font-light">Texto com peso light (300)</p>
      <p className="text-base font-medium">Texto com peso medium (500)</p>
      <p className="text-base font-bold">Texto com peso bold (700)</p>
      
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-2xl font-semibold mb-2">Classes CSS aplicadas:</h2>
        <p className="text-sm text-gray-600">
          font-family: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
        </p>
        <p className="text-sm text-gray-600">
          Classe Tailwind: font-sans
        </p>
      </div>
    </div>
  );
}
