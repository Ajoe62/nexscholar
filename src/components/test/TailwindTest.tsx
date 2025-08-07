export default function TailwindTest() {
  return (
    <div className="p-4 m-4 border-2 border-dashed border-gray-300">
      <h1 className="text-2xl font-bold mb-4">TailwindCSS Test</h1>

      {/* Basic Colors Test */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Basic Colors:</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="w-16 h-16 bg-red-500 rounded flex items-center justify-center text-white text-xs">
            Red
          </div>
          <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
            Blue
          </div>
          <div className="w-16 h-16 bg-green-500 rounded flex items-center justify-center text-white text-xs">
            Green
          </div>
          <div className="w-16 h-16 bg-yellow-500 rounded flex items-center justify-center text-white text-xs">
            Yellow
          </div>
        </div>
      </div>

      {/* Custom Colors Test */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Custom Colors:</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="w-16 h-16 bg-primary-600 rounded flex items-center justify-center text-white text-xs">
            Primary
          </div>
          <div className="w-16 h-16 bg-secondary-500 rounded flex items-center justify-center text-white text-xs">
            Secondary
          </div>
        </div>
      </div>

      {/* Buttons Test */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Button Styles:</h2>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-outline">Outline Button</button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <p className="text-sm">
          <span className="font-semibold">Status:</span>
          <span className="text-green-600">
            {" "}
            ✓ TailwindCSS is working if you see colors and styling
          </span>
        </p>
      </div>
    </div>
  );
}
