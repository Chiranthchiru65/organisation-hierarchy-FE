import { useState, useEffect } from "react";
import Tree from "react-d3-tree";
import { getHierarchy } from "@/services/employeeService";

// transform data for react-d3-tree
const transformToD3TreeFormat = (node: any) => ({
  name: node.name,
  attributes: {
    position: node.position,
    department: node.department,
    employeeId: node.employeeId,
  },
  children: node.children?.map(transformToD3TreeFormat) || [],
});

// custom node component
const CustomNode = ({ nodeDatum }) => (
  <g>
    <foreignObject width="190" height="90" x="-95" y="-45">
      <div className="w-full h-full flex items-center justify-center p-1">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow w-full">
          <div className="text-sm font-semibold text-gray-800 capitalize truncate">
            {nodeDatum.name}
          </div>
          <div className="text-xs text-gray-600 mt-1 capitalize truncate">
            {nodeDatum.attributes?.position}
          </div>
          <div className="text-xs text-green-600 mt-1 font-medium">
            {nodeDatum.attributes?.department}
          </div>
        </div>
      </div>
    </foreignObject>
  </g>
);

export default function HierarchyPage() {
  const [hierarchyData, setHierarchyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHierarchyData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getHierarchy();
        setHierarchyData(response.data || []);
      } catch (err: any) {
        console.error("Error fetching hierarchy:", err);
        setError(err.message || "Failed to load hierarchy data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHierarchyData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <div className="text-green-600 text-lg font-medium">
            Loading hierarchy...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="text-center bg-white p-8 rounded-lg shadow-md border border-red-200">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Error Loading Hierarchy
          </div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!hierarchyData || hierarchyData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="text-center bg-white p-8 rounded-lg shadow-md border border-green-200">
          <div className="text-gray-600 text-lg">
            No hierarchy data available
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Add employees to see the organization structure
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Organization Hierarchy
        </h1>
        <p className="text-gray-600 mb-6">
          Visual representation of organizational structure
        </p>

        {/* tabs */}
        {hierarchyData.length > 1 && (
          <div className="flex gap-2 ">
            {hierarchyData.map((rootNode, idx) => (
              <button
                key={crypto.randomUUID()}
                onClick={() => setActiveTab(idx)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === idx
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-green-100 border border-green-200"
                }`}
              >
                {rootNode.name}'s Organization
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full" style={{ height: "calc(100vh - 180px)" }}>
        {hierarchyData.length > 0 && (
          <div style={{ height: "100%", width: "100%" }}>
            <Tree
              data={transformToD3TreeFormat(hierarchyData[activeTab])}
              orientation="horizontal"
              pathFunc="step"
              translate={{ x: 150, y: 400 }}
              nodeSize={{ x: 200, y: 200 }}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
              renderCustomNodeElement={(rd3tProps) => (
                <CustomNode {...rd3tProps} />
              )}
              pathClassFunc={() => "custom-link"}
              enableLegacyTransitions
              transitionDuration={500}
            />
            <style>{`
              .custom-link {
                stroke: #519269;
                stroke-width: 2px;
                fill: none;
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
