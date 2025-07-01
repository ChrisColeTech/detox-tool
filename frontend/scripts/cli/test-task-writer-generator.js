#!/usr/bin/env node

/**
 * Test Task-Writer's ScaffoldGenerator
 * Use task-writer's actual ScaffoldGenerator to create scaffold scripts
 * Test it by generating scripts from task-writer's own layout components
 */

const path = require('path');

// Import local copies of task-writer's services
const ScaffoldGenerator = require('./ScaffoldGenerator.cjs');
const DirectoryScanner = require('./DirectoryScanner.cjs');

async function testTaskWriterGenerator() {
  console.log('🧪 Testing Task-Writer\'s ScaffoldGenerator');
  console.log('==========================================\n');

  try {
    // Initialize task-writer's services
    const scaffoldGenerator = new ScaffoldGenerator();
    const directoryScanner = new DirectoryScanner();

    // Test 1: Scan task-writer's layout components directory
    console.log('📁 Test 1: Scanning task-writer\'s layout components...');
    const layoutDir = '/mnt/c/Projects/task-writer/frontend/app/src/components/layout';
    
    const scanResult = await directoryScanner.scanDirectory(layoutDir, {
      excludeNodeModules: true,
      fileTypeFilter: ['.tsx', '.ts'],
      includeContent: true
    });

    console.log(`   ✅ Found ${scanResult.stats.totalFiles} files`);
    console.log(`   📊 Scan time: ${scanResult.stats.scanTime}ms\n`);

    // Test 2: Generate scaffold script from layout components
    console.log('🔧 Test 2: Generating scaffold script...');
    
    const scaffoldResult = await scaffoldGenerator.generateScaffold(layoutDir, {
      targetOS: 'cross-platform',
      includeContent: true,
      createDirectoriesOnly: false,
      addComments: true,
      scriptName: 'create-detox-layout-components',
      outputFormat: 'bash',
      includeReadme: true,
      supportedFileTypes: ['.tsx', '.ts', '.jsx', '.js'],
      templateVariables: {}
    });

    console.log(`   ✅ Generated ${scaffoldResult.stats.totalScripts} scripts`);
    console.log(`   📄 Files processed: ${scaffoldResult.stats.totalFiles}`);
    console.log(`   📁 Directories: ${scaffoldResult.stats.totalDirectories}\n`);

    // Test 3: Save the generated scripts
    console.log('💾 Test 3: Saving generated scripts...');
    
    const fs = require('fs').promises;
    
    for (let i = 0; i < scaffoldResult.scaffolds.length; i++) {
      const scaffold = scaffoldResult.scaffolds[i];
      
      // Create descriptive filename based on content
      let filename;
      if (scaffold.content.includes('cat > "Layout.tsx"')) {
        filename = 'create-detox-layout-components.sh';
      } else if (scaffold.content.includes('# Scaffold Script')) {
        filename = 'create-detox-layout-components-README.md';
      } else {
        filename = `scaffold-${i + 1}-${scaffold.type || 'script'}.sh`;
      }
      
      const outputPath = `/mnt/c/projects/detox-tool/frontend/docs/${filename}`;
      
      await fs.writeFile(outputPath, scaffold.content);
      
      console.log(`   ✅ Saved: ${filename} (${scaffold.content.length} chars)`);
      console.log(`      Type: ${scaffold.type || 'unknown'}`);
      
      // Show first few lines of content to understand what was generated
      const lines = scaffold.content.split('\n').slice(0, 5);
      console.log(`      Preview: ${lines[0]}...`);
    }

    console.log('\n🎉 Task-Writer ScaffoldGenerator test completed successfully!');
    console.log('\n📋 Generated scripts can be found in:');
    console.log('   /mnt/c/projects/detox-tool/frontend/docs/');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Review the generated scaffold scripts');
    console.log('   2. Run the scripts to create layout components');
    console.log('   3. Test the generated components in detox-tool');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Test additional functionality
async function testDirectoryStructureGeneration() {
  console.log('\n🔍 Testing directory structure generation...');
  
  try {
    const directoryScanner = new DirectoryScanner();
    
    // Get flat structure representation
    const structure = await directoryScanner.getDirectoryStructure(
      '/mnt/c/Projects/task-writer/frontend/app/src/components/layout'
    );
    
    console.log('📊 Directory structure:');
    for (const line of structure) {
      console.log(`   ${line}`);
    }
    
  } catch (error) {
    console.error('   ❌ Structure generation failed:', error.message);
  }
}

// Test hook scanning
async function testHooksScanning() {
  console.log('\n🪝 Testing hooks directory scanning...');
  
  try {
    const directoryScanner = new DirectoryScanner();
    
    const hooksResult = await directoryScanner.scanDirectory(
      '/mnt/c/Projects/task-writer/frontend/app/src/hooks',
      {
        excludeNodeModules: true,
        fileTypeFilter: ['.ts'],
        includeContent: false
      }
    );
    
    console.log(`   ✅ Found ${hooksResult.stats.totalFiles} hook files`);
    
    // List the hooks found
    function listFiles(tree) {
      if (Array.isArray(tree)) {
        for (const node of tree) {
          listFiles(node);
        }
      } else if (tree.type === 'file') {
        console.log(`   📄 ${tree.name}`);
      } else if (tree.children) {
        for (const child of tree.children) {
          listFiles(child);
        }
      }
    }
    
    listFiles(hooksResult.tree);
    
  } catch (error) {
    console.error('   ❌ Hooks scanning failed:', error.message);
  }
}

// Main execution
async function main() {
  await testTaskWriterGenerator();
  await testDirectoryStructureGeneration();
  await testHooksScanning();
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testTaskWriterGenerator };