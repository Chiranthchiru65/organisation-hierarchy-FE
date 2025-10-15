import { useState, useEffect } from "react";
import Tree from "react-d3-tree";

const mockHierarchyData = [
  {
    _id: "68ef476c6d0454122e08b843",
    employeeId: "EMP01",
    name: "eric",
    email: "eric@gmail.com",
    position: "CEO",
    department: "Executive",
    managerId: "",
    children: [
      {
        _id: "68ef4aca6d0454122e08b854",
        employeeId: "EMP02",
        name: "virat",
        position: "CMO",
        department: "Executive",
        managerId: "EMP01",
        children: [
          {
            _id: "68ef4b926d0454122e08b860",
            employeeId: "EMP04",
            name: "rohit",
            position: "head of engineering",
            department: "engineering",
            managerId: "EMP02",
            children: [],
          },
          {
            _id: "68ef4c586d0454122e08b866",
            employeeId: "EMP05",
            name: "bhumra",
            position: "head of design",
            department: "design",
            managerId: "EMP02",
            children: [],
          },
        ],
      },
      {
        _id: "68ef4b1f6d0454122e08b85b",
        employeeId: "EMP03",
        name: "kohli",
        position: "CFO",
        department: "Executive",
        managerId: "EMP01",
        children: [],
      },
    ],
  },
];

const transformToD3TreeFormat = (node: any) => ({
  name: node.name,
  attributes: {
    position: node.position,
    department: node.department,
    employeeId: node.employeeId,
  },
  children: node.children?.map(transformToD3TreeFormat) || [],
});

const CustomNode = ({ nodeDatum }) => (
  <g>
    <foreignObject width="180" height="80" x="-90" y="-40">
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
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
    </foreignObject>
  </g>
);

export default function HierarchyPage() {
  const [hierarchyData, setHierarchyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHierarchyData = async () => {
      try {
        setIsLoading(true);

        setTimeout(() => {
          setHierarchyData(mockHierarchyData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchHierarchyData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-600 text-lg">Loading hierarchy...</div>
      </div>
    );
  }

  if (!hierarchyData || hierarchyData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg">No hierarchy data available</div>
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
      </div>

      <div className="w-full" style={{ height: "calc(100vh - 140px)" }}>
        {hierarchyData.map((rootNode, idx) => {
          const treeData = transformToD3TreeFormat(rootNode);

          return (
            <div
              key={rootNode._id}
              style={{
                height: hierarchyData.length > 1 ? "50%" : "100%",
                width: "100%",
              }}
            >
              <Tree
                data={treeData}
                orientation="horizontal"
                pathFunc="step"
                translate={{ x: 150, y: hierarchyData.length > 1 ? 200 : 400 }}
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
                  stroke: #3d694d;
                  stroke-width: 2px;
                  fill: none;
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </div>
  );
}
