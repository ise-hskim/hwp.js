// Simple script to parse HWP files without build step
const path = require('path');
const fs = require('fs');

// Register babel for TypeScript support
require('@babel/register')({
  extensions: ['.ts', '.js'],
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
  only: [
    function(filepath) {
      return filepath.includes('packages/parser/src');
    }
  ]
});

// Now require the parser - using default export
const parse = require('./packages/parser/src/parse').default;

async function parseHwpFiles() {
  const tempDir = path.join(__dirname, 'Temp');
  
  // Temp 디렉토리의 모든 .hwp 파일 찾기
  const files = fs.readdirSync(tempDir).filter(file => 
    file.endsWith('.hwp') && !file.endsWith('.hwpx')
  );
  
  console.log(`Found ${files.length} HWP files to parse:`);
  console.log(files);
  
  for (const file of files) {
    const hwpPath = path.join(tempDir, file);
    const jsonPath = path.join(tempDir, file.replace('.hwp', '_parsed.json'));
    
    try {
      console.log(`\nParsing: ${file}`);
      
      // HWP 파일 읽기
      const buffer = fs.readFileSync(hwpPath);
      
      // 파싱 실행
      const startTime = Date.now();
      const document = parse(buffer, { type: 'buffer' });
      const endTime = Date.now();
      
      console.log(`✅ Parsed successfully in ${endTime - startTime}ms`);
      
      // JSON으로 저장 (순환 참조 처리)
      const jsonContent = JSON.stringify(document, (key, value) => {
        // Buffer나 ArrayBuffer는 크기만 표시
        if (value instanceof Buffer || value instanceof ArrayBuffer || value instanceof Uint8Array) {
          return {
            type: 'Buffer',
            length: value.length,
            preview: value.length > 100 ? '[Binary data]' : Array.from(value.slice(0, 100))
          };
        }
        return value;
      }, 2);
      
      fs.writeFileSync(jsonPath, jsonContent, 'utf-8');
      console.log(`📄 Saved to: ${jsonPath}`);
      
      // 기본 정보 출력
      console.log(`  - Version: ${document.header.version}`);
      console.log(`  - Sections: ${document.sections.length}`);
      if (document.sections.length > 0) {
        const totalParagraphs = document.sections.reduce((sum, section) => 
          sum + (section.paragraphList?.paragraphs?.length || 0), 0
        );
        console.log(`  - Total paragraphs: ${totalParagraphs}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to parse ${file}:`, error);
      
      // 에러 정보도 저장
      const errorJsonPath = path.join(tempDir, file.replace('.hwp', '_error.json'));
      fs.writeFileSync(errorJsonPath, JSON.stringify({
        file: file,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        timestamp: new Date().toISOString()
      }, null, 2), 'utf-8');
    }
  }
}

// 실행
parseHwpFiles().catch(console.error);