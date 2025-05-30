import fs from 'fs';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// USD file generator for triplet network visualization
class TripletsToUSDConverter {
  constructor() {
    this.nodes = new Map();
    this.relationships = [];
    this.nodeCounter = 0;
    this.colors = {
      'LEGO': [0.2, 0.6, 1.0], // Blue for consumers
      'Adult': [0.8, 0.2, 0.2], // Red for segments
      'Gift': [0.8, 0.2, 0.2],
      'Serious': [0.8, 0.2, 0.2],
      'Teens': [0.8, 0.2, 0.2],
      'Parents': [0.8, 0.2, 0.2],
      'North': [0.2, 0.8, 0.2], // Green for regions
      'Europe': [0.2, 0.8, 0.2],
      'Asia': [0.2, 0.8, 0.2],
      'Emerging': [0.2, 0.8, 0.2],
      'default': [0.7, 0.7, 0.7] // Gray for others
    };
  }

  getNodeColor(nodeId) {
    for (const [key, color] of Object.entries(this.colors)) {
      if (nodeId.toString().startsWith(key)) {
        return color;
      }
    }
    return this.colors.default;
  }

  getNodeSize(nodeType) {
    const sizes = {
      'consumer': 0.05,
      'segment': 0.15,
      'region': 0.12,
      'country': 0.08,
      'category': 0.10,
      'default': 0.06
    };
    return sizes[nodeType] || sizes.default;
  }

  inferNodeType(nodeId) {
    const id = nodeId.toString();
    if (id.startsWith('LEGO_')) return 'consumer';
    if (['Adult Collectors', 'Gift Buyers', 'Serious Builders', 'Teens and Young Adults', 'Parents'].includes(id)) return 'segment';
    if (['North America', 'Europe', 'Asia Pacific', 'Emerging Markets'].includes(id)) return 'region';
    if (['architecture', 'technic', 'starwars', 'ninjago', 'harrypotter', 'creator', 'friends', 'city'].includes(id)) return 'category';
    if (['USA', 'Canada', 'Mexico', 'Germany', 'UK', 'France', 'Italy', 'Spain', 'Netherlands', 'Japan', 'Australia', 'South Korea', 'Singapore', 'Brazil', 'India', 'China', 'Russia'].includes(id)) return 'country';
    return 'attribute';
  }

  addNode(nodeId) {
    if (!this.nodes.has(nodeId)) {
      const nodeType = this.inferNodeType(nodeId);
      const position = this.generateNodePosition(nodeType);
      this.nodes.set(nodeId, {
        id: this.nodeCounter++,
        label: nodeId,
        type: nodeType,
        position: position,
        color: this.getNodeColor(nodeId),
        size: this.getNodeSize(nodeType)
      });
    }
    return this.nodes.get(nodeId);
  }

  generateNodePosition(nodeType) {
    // Generate positions in different regions of 3D space based on node type
    const typePositions = {
      'consumer': () => [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 20
      ],
      'segment': () => [
        (Math.random() - 0.5) * 8,
        5 + Math.random() * 3,
        (Math.random() - 0.5) * 8
      ],
      'region': () => [
        (Math.random() - 0.5) * 6,
        8 + Math.random() * 2,
        (Math.random() - 0.5) * 6
      ],
      'country': () => [
        (Math.random() - 0.5) * 12,
        -2 + Math.random() * 2,
        (Math.random() - 0.5) * 12
      ],
      'category': () => [
        (Math.random() - 0.5) * 10,
        -5 + Math.random() * 2,
        (Math.random() - 0.5) * 10
      ],
      'default': () => [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 15
      ]
    };

    return (typePositions[nodeType] || typePositions.default)();
  }

  addRelationship(subject, predicate, object, confidence) {
    const subjectNode = this.addNode(subject);
    const objectNode = this.addNode(object);
    
    this.relationships.push({
      subject: subjectNode.id,
      object: objectNode.id,
      predicate: predicate,
      confidence: confidence,
      subjectPos: subjectNode.position,
      objectPos: objectNode.position
    });
  }

  generateUSDContent() {
    const usdContent = `#usda 1.0
(
    defaultPrim = "TripletNetwork"
    upAxis = "Y"
)

def Xform "TripletNetwork"
{
    def Scope "Nodes"
    {
${this.generateNodesUSD()}
    }

    def Scope "Relationships"
    {
${this.generateRelationshipsUSD()}
    }

    def Scope "Lighting"
    {
        def DomeLight "DomeLight"
        {
            float intensity = 1.0
            asset inputs:texture:file = @./hdri_sky.hdr@
        }

        def DistantLight "KeyLight"
        {
            float intensity = 3.0
            float3 xformOp:rotateXYZ = (45, 45, 0)
            uniform token[] xformOpOrder = ["xformOp:rotateXYZ"]
        }
    }

    def Camera "Camera"
    {
        double3 xformOp:translate = (25, 15, 25)
        float3 xformOp:rotateXYZ = (-15, 45, 0)
        uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:rotateXYZ"]
        
        float focalLength = 50
        float focusDistance = 30
    }
}

# Metadata
def "Metadata"
{
    custom string description = "Consumer Profile Triplets Network Visualization"
    custom int totalNodes = ${this.nodes.size}
    custom int totalRelationships = ${this.relationships.length}
    custom string[] nodeTypes = ["consumer", "segment", "region", "country", "category", "attribute"]
    custom string generator = "Consumer Behavior Analysis Framework"
    custom string version = "1.0"
}
`;

    return usdContent;
  }

  generateNodesUSD() {
    let nodesUSD = '';
    
    for (const [nodeId, node] of this.nodes) {
      const safeName = this.sanitizeUSDName(nodeId);
      const [x, y, z] = node.position;
      const [r, g, b] = node.color;
      
      nodesUSD += `
        def Sphere "Node_${node.id}_${safeName}"
        {
            double3 xformOp:translate = (${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)})
            double3 xformOp:scale = (${node.size}, ${node.size}, ${node.size})
            uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:scale"]
            
            def Material "NodeMaterial"
            {
                token outputs:surface.connect = </TripletNetwork/Nodes/Node_${node.id}_${safeName}/NodeMaterial/PBRShader.outputs:surface>
                
                def Shader "PBRShader"
                {
                    uniform token info:id = "UsdPreviewSurface"
                    color3f inputs:diffuseColor = (${r}, ${g}, ${b})
                    float inputs:metallic = 0.1
                    float inputs:roughness = 0.4
                    token outputs:surface
                }
            }
            
            rel material:binding = </TripletNetwork/Nodes/Node_${node.id}_${safeName}/NodeMaterial>
            
            # Custom attributes for node data
            custom string nodeLabel = "${nodeId}"
            custom string nodeType = "${node.type}"
            custom int nodeId = ${node.id}
        }`;
    }
    
    return nodesUSD;
  }

  generateRelationshipsUSD() {
    let relationshipsUSD = '';
    
    this.relationships.forEach((rel, index) => {
      if (index % 100 === 0) { // Sample relationships to avoid too many lines
        const [x1, y1, z1] = rel.subjectPos;
        const [x2, y2, z2] = rel.objectPos;
        
        // Calculate midpoint and direction for cylinder
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const midZ = (z1 + z2) / 2;
        
        const distance = Math.sqrt(
          Math.pow(x2 - x1, 2) + 
          Math.pow(y2 - y1, 2) + 
          Math.pow(z2 - z1, 2)
        );
        
        const alpha = Math.min(rel.confidence, 0.8);
        
        relationshipsUSD += `
        def Cylinder "Relationship_${index}"
        {
            double3 xformOp:translate = (${midX.toFixed(3)}, ${midY.toFixed(3)}, ${midZ.toFixed(3)})
            double3 xformOp:scale = (0.02, ${(distance/2).toFixed(3)}, 0.02)
            uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:scale"]
            
            def Material "RelationshipMaterial"
            {
                token outputs:surface.connect = </TripletNetwork/Relationships/Relationship_${index}/RelationshipMaterial/PBRShader.outputs:surface>
                
                def Shader "PBRShader"
                {
                    uniform token info:id = "UsdPreviewSurface"
                    color3f inputs:diffuseColor = (0.6, 0.6, 0.6)
                    float inputs:opacity = ${alpha}
                    float inputs:metallic = 0.8
                    float inputs:roughness = 0.2
                    token outputs:surface
                }
            }
            
            rel material:binding = </TripletNetwork/Relationships/Relationship_${index}/RelationshipMaterial>
            
            # Custom attributes for relationship data
            custom string predicate = "${rel.predicate}"
            custom float confidence = ${rel.confidence}
            custom int subjectNodeId = ${rel.subject}
            custom int objectNodeId = ${rel.object}
        }`;
      }
    });
    
    return relationshipsUSD;
  }

  sanitizeUSDName(name) {
    return name.toString()
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .replace(/^(\d)/, '_$1')
      .substring(0, 50); // Limit length
  }
}

// Load triplets from CSV and convert to USD
async function convertTripletsToUSD() {
  console.log('🚀 Starting Triplets to USD Conversion...');
  console.log('==========================================');
  
  try {
    console.log('📊 Loading consumer profile triplets...');
    
    const converter = new TripletsToUSDConverter();
    const triplets = [];
    
    const stream = createReadStream('consumer_profile_triplets.csv')
      .pipe(parse({ columns: true, skip_empty_lines: true }));
    
    let processedCount = 0;
    for await (const record of stream) {
      triplets.push(record);
      
      // Sample the data to avoid overwhelming the 3D scene
      if (processedCount % 50 === 0 || ['demographic', 'geographic', 'behavioral'].includes(record.Type)) {
        converter.addRelationship(
          record.Subject,
          record.Predicate,
          record.Object,
          parseFloat(record.Confidence)
        );
      }
      processedCount++;
    }
    
    console.log(`✅ Processed ${processedCount} triplets`);
    console.log(`🎯 Selected ${converter.relationships.length} relationships for 3D visualization`);
    console.log(`🔗 Created ${converter.nodes.size} unique nodes`);
    
    console.log('🎨 Generating USD scene content...');
    const usdContent = converter.generateUSDContent();
    
    console.log('💾 Writing USD file...');
    const outputPath = join(__dirname, 'consumer_triplets_network.usda');
    fs.writeFileSync(outputPath, usdContent);
    
    // Generate metadata JSON file
    const metadata = {
      title: "Consumer Profile Triplets Network",
      description: "3D visualization of consumer behavior relationships extracted from LEGO customer data",
      totalTriplets: processedCount,
      visualizedRelationships: converter.relationships.length,
      nodes: converter.nodes.size,
      nodeTypes: [...new Set([...converter.nodes.values()].map(n => n.type))],
      predicates: [...new Set(converter.relationships.map(r => r.predicate))],
      generator: "Consumer Behavior Analysis Framework",
      created: new Date().toISOString(),
      format: "USD (Universal Scene Description)",
      software: "Compatible with USD-enabled 3D software (Blender, Maya, Houdini, etc.)"
    };
    
    const metadataPath = join(__dirname, 'consumer_triplets_network_metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    console.log('\n✅ USD conversion completed successfully!');
    console.log('📄 Generated files:');
    console.log(`  - consumer_triplets_network.usda (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`  - consumer_triplets_network_metadata.json`);
    
    console.log('\n🎯 Visualization Details:');
    console.log('==========================');
    console.log(`🔵 Blue Spheres: Consumer profiles (${[...converter.nodes.values()].filter(n => n.type === 'consumer').length})`);
    console.log(`🔴 Red Spheres: Customer segments (${[...converter.nodes.values()].filter(n => n.type === 'segment').length})`);
    console.log(`🟢 Green Spheres: Geographic regions (${[...converter.nodes.values()].filter(n => n.type === 'region').length})`);
    console.log(`⚪ Gray Spheres: Other attributes (${[...converter.nodes.values()].filter(n => !['consumer', 'segment', 'region'].includes(n.type)).length})`);
    console.log(`🔗 Gray Cylinders: Relationships (${converter.relationships.length})`);
    
    console.log('\n🛠️  Usage Instructions:');
    console.log('========================');
    console.log('1. Open the .usda file in USD-compatible software:');
    console.log('   - Blender (with USD add-on)');
    console.log('   - Autodesk Maya (with USD plugin)');
    console.log('   - SideFX Houdini');
    console.log('   - Pixar USDView');
    console.log('   - NVIDIA Omniverse');
    console.log('2. The scene includes lighting and camera setup');
    console.log('3. Node colors represent different entity types');
    console.log('4. Relationship thickness represents confidence levels');
    
    return {
      converter,
      metadata,
      outputPath,
      metadataPath
    };
    
  } catch (error) {
    console.error('❌ Error during USD conversion:', error);
    throw error;
  }
}

// Export functions
export { TripletsToUSDConverter, convertTripletsToUSD };

// Run if executed directly
if (import.meta.url.includes(process.argv[1])) {
  convertTripletsToUSD()
    .then(() => {
      console.log('\n🎉 Triplets to USD conversion completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ USD conversion failed:', error);
      process.exit(1);
    });
} 