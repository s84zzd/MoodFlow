// 读取 moods.ts 文件并提取心语数据
const fs = require('fs');

const content = fs.readFileSync('./src/data/moods.ts', 'utf8');

// 提取通用语录
const generalQuotesMatch = content.match(/export const inspirationalQuotes = \[([\s\S]*?)\];/);
let csvContent = '类型,情绪ID,情绪名称,心语内容,作者\n';

// 添加通用语录
if (generalQuotesMatch) {
  const generalQuotes = generalQuotesMatch[1].match(/{ text: '([^']+)', author: '([^']+)' }/g);
  if (generalQuotes) {
    generalQuotes.forEach((quote, index) => {
      const textMatch = quote.match(/text: '([^']+)'/);
      const authorMatch = quote.match(/author: '([^']+)'/);
      if (textMatch && authorMatch) {
        csvContent += `通用,general,通用,${textMatch[1]},${authorMatch[1]}\n`;
      }
    });
  }
}

// 提取情绪分类心语
const moodQuotesMatch = content.match(/export const moodQuotes: Record<string[^>]+> = {([\s\S]*?)};/);

if (moodQuotesMatch) {
  const moodSections = moodQuotesMatch[1].split(/\/\/ ([^\n]+)/);
  
  for (let i = 1; i < moodSections.length; i += 2) {
    const moodName = moodSections[i].trim();
    const sectionContent = moodSections[i + 1];
    
    // 提取情绪ID
    const moodIdMatch = sectionContent.match(/(\w+): \[/);
    if (moodIdMatch) {
      const moodId = moodIdMatch[1];
      
      // 提取该情绪的所有心语
      const quotes = sectionContent.match(/{ text: '([^']+)', author: '([^']+)' }/g);
      if (quotes) {
        quotes.forEach(quote => {
          const textMatch = quote.match(/text: '([^']+)'/);
          const authorMatch = quote.match(/author: '([^']+)'/);
          if (textMatch && authorMatch) {
            csvContent += `情绪,${moodId},${moodName},${textMatch[1]},${authorMatch[1]}\n`;
          }
        });
      }
    }
  }
}

// 写入CSV文件
fs.writeFileSync('./quotes_export.csv', '\uFEFF' + csvContent, 'utf8');
console.log('✅ 每日心语已导出到 quotes_export.csv');
console.log(`📊 总计: ${csvContent.split('\n').length - 2} 条心语`);
